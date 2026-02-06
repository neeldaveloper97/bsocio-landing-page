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
            `[Job ${job.id}] 🚀 STARTED processing campaign ${campaignId} (Cursor: ${cursor || 'START'})`,
        );

        const campaign = await this.prisma.emailCampaign.findUnique({
            where: { id: campaignId },
        });

        if (!campaign) {
            this.logger.error(`[Job ${job.id}] ❌ Campaign ${campaignId} not found`);
            return;
        }

        // Initialize whre clause. Prisma's `not: null` syntax is a bit tricky sometimes depending on versions.
        // Usually `email: { not: null }` works, but the error says `Argument not must not be null`.
        // This implies `null` is being passed into `not`.
        // The safest way to filter non-null is strictly checking existence or using string filters.
        const whereClause: any = {};

        if ((campaign.audience as any) === 'MANUAL_SELECTION') {
            const targetIds = (campaign as any).targetUserIds;
            if (targetIds && targetIds.length > 0) {
                whereClause.id = { in: targetIds };
                this.logger.log(`[Job ${job.id}] Targeting ${targetIds.length} specific users (Manual Selection)`);
            } else {
                this.logger.warn(`[Job ${job.id}] ⚠️ Campaign is MANUAL but has no target IDs. Stopping.`);
                return;
            }
        } else if ((campaign.audience as any) === 'SEGMENTED_USERS') {
            const filters = (campaign as any).filters;
            this.logger.log(`[Job ${job.id}] Applying filters: ${JSON.stringify(filters)}`);
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
        } else {
            this.logger.log(`[Job ${job.id}] Targeting ALL users`);
        }

        const batchSize = 50; // Process 50 users at a time
        let hasMore = true;
        let totalProcessedInJob = 0;
        let successCount = 0;
        let failCount = 0;

        try {
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

                this.logger.log(`[Job ${job.id}] Fetched batch of ${users.length} users...`);

                if (users.length === 0) {
                    hasMore = false;
                    break;
                }

                // Send emails sequentially with rate limiting to avoid SMTP ban
                for (const user of users) {
                    try {
                        // Rate limiter: 500ms delay between emails (approx 2 emails/sec)
                        await new Promise((resolve) => setTimeout(resolve, 500));

                        await this.mailService.sendMail({
                            to: user.email,
                            subject: campaign.subject,
                            html: campaign.content,
                        });
                        successCount++;
                    } catch (e) {
                        failCount++;
                        this.logger.error(`[Job ${job.id}] ❌ Failed to email ${user.email}: ${(e as Error).message}`);
                    }
                }

                const processedCount = users.length;
                totalProcessedInJob += processedCount;

                // Update stats in DB
                await this.prisma.emailCampaign.update({
                    where: { id: campaignId },
                    data: {
                        totalSent: { increment: processedCount },
                    },
                });

                // Update cursor for next iteration
                cursor = users[users.length - 1].id;

                // Checkpoint in Redis: Save cursor
                await job.updateData({ campaignId, cursor });

                if (users.length < batchSize) {
                    hasMore = false;
                }
            }
        } catch (error) {
            this.logger.error(`[Job ${job.id}] 💥 Critical error in processing loop: ${(error as Error).message}`, (error as Error).stack);
            throw error;
        }

        this.logger.log(
            `[Job ${job.id}] ✅ FINISHED. Processed: ${totalProcessedInJob} | Sent: ${successCount} | Failed: ${failCount}`,
        );
    }
}
