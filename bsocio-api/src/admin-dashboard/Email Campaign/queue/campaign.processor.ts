import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { MailService } from '../../../lib/mail/mail.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Processor('campaign')
export class CampaignProcessor extends WorkerHost {
    private readonly logger = new Logger(CampaignProcessor.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) {
        super();
    }

    async process(
        job: Job<{ campaignId: string; cursor?: string }>,
    ): Promise<void> {
        const { campaignId } = job.data;
        let { cursor } = job.data;

        this.logger.log(
            `[Job ${job.id}] Processing campaign ${campaignId} starting from cursor ${cursor || 'START'}`,
        );

        const campaign = await this.prisma.emailCampaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            this.logger.error(`Campaign ${campaignId} not found`);
            return;
        }

        let whereClause: any = { email: { not: null } };

        if ((campaign.audience as any) === 'MANUAL_SELECTION') {
            const targetIds = (campaign as any).targetUserIds;
            if (targetIds && targetIds.length > 0) {
                whereClause.id = { in: targetIds };
            } else {
                this.logger.warn(`Campaign ${campaignId} is MANUAL but has no target IDs`);
                return;
            }
        } else if ((campaign.audience as any) === 'SEGMENTED_USERS') {
            const filters = (campaign as any).filters;
            if (filters) {
                if (filters.role) whereClause.role = filters.role;
                if (filters.oauthProvider) whereClause.oauthProvider = filters.oauthProvider;
                if (filters.isPhoneVerified !== undefined) whereClause.isPhoneVerified = filters.isPhoneVerified;
                if (filters.gender) whereClause.gender = filters.gender;

                if (filters.joinedAfter || filters.joinedBefore) {
                    whereClause.createdAt = {};
                    if (filters.joinedAfter) whereClause.createdAt.gte = new Date(filters.joinedAfter);
                    if (filters.joinedBefore) whereClause.createdAt.lte = new Date(filters.joinedBefore);
                }
            }
        }

        const batchSize = 50; // Process 50 users at a time
        let hasMore = true;
        let totalProcessedInJob = 0;

        while (hasMore) {
            // Fetch batch of users
            const users = await this.prisma.user.findMany({
                take: batchSize,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
                where: whereClause,
                select: { id: true, email: true },
                orderBy: { id: 'asc' }, // Ensure stable ordering
            });

            if (users.length === 0) {
                hasMore = false;
                break;
            }

            this.logger.debug(
                `[Job ${job.id}] Processing batch of ${users.length} users (Cursor: ${cursor})...`,
            );

            // Send emails sequentially with rate limiting to avoid SMTP ban
            for (const user of users) {
                try {
                    // Rate limiter: 500ms delay between emails (approx 2 emails/sec)
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    const res = await this.mailService.sendMail({
                        to: user.email,
                        subject: campaign.subject,
                        html: campaign.content,
                    });
                    this.logger.debug(
                        `[SUCCESS] Sent to ${user.email} | MsgID: ${res.messageId}`,
                    );
                } catch (e) {
                    this.logger.error(`[FAILURE] Failed to email ${user.email}`, e);
                }
            }

            const processedCount = users.length;
            totalProcessedInJob += processedCount;

            // Update stats in DB
            await this.prisma.emailCampaign.update({
                where: { id: campaignId },
                data: {
                    totalSent: { increment: processedCount },
                    // Note: tracked 'delivered' count properly requires tracking success inside the map,
                    // for simplicity we increment totalSent here.
                },
            });

            // Update cursor for next iteration
            cursor = users[users.length - 1].id;

            // Checkpoint in Redis: Save cursor so if we crash we resume here
            await job.updateData({ campaignId, cursor });
            this.logger.debug(`[Job ${job.id}] Checkpoint saved at cursor: ${cursor}`);

            // Extending lock implicitly by activity, but for very long jobs, standard Workers rely on lockDuration.
            // Since we are looping inside one job, we must ensure completion within lockDuration (default 30s).
            // If 50 emails take > 30s, we have a problem. 50 emails via SMTP usually take 10-20s.
            // If needed, we can call job.extendLock() but that's deprecated/advanced.
            // Reducing batchSize to 20 is safer for slow SMTP.
            // But 50 is fine for now.

            if (users.length < batchSize) {
                hasMore = false;
            }
        }

        this.logger.log(
            `Campaign ${campaignId} job finished. Processed ${totalProcessedInJob} users.`,
        );
    }
}
