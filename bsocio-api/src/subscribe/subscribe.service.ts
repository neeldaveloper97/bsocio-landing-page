import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { MailService } from '../lib/mail/mail.service';

@Injectable()
export class SubscribeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) { }

    async subscribe(subscribeDto: SubscribeDto) {
        const { email } = subscribeDto;

        // Check if user exists as subscriber
        // Since we don't have a Subscriber model, we'll assume we can use the EmailCampaign audience or create a new Subscriber model to track this accurately.
        // However, the user request says "just store the emails provided by user".
        // Let's create a Subscriber model or use an existing one if suitable.
        // Looking at schema.prisma, there isn't a Subscriber model.
        // User request: "store the emails provided by user".
        // I should probably add a Subscriber model to the schema first?
        // Or stick it in a simple table.

        // Wait, let's check schema again.
        // There is EmailCampaign model with audience but no distinct subscriber list model.
        // I should create a Subscriber model.

        // But first, let's implement the service assuming the model exists or will be added.

        const existingSubscriber = await this.prisma.subscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            // If already subscribed, maybe just return success to avoid leaking info?
            // Or throw "Already subscribed".
            // User experience: "You are already subscribed!"
            return { message: 'You are already subscribed!' };
        }

        await this.prisma.subscriber.create({
            data: {
                email,
            },
        });

        // Send confirmation email
        await this.mailService.sendMail({
            to: email,
            subject: 'Welcome to BSocio!',
            html: `
        <h1>Welcome to BSocio!</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will now receive notifications about important events and updates.</p>
        <br>
        <p>Best Regards,</p>
        <p>The BSocio Team</p>
      `,
        });

        return { message: 'Subscription successful! Please check your email.' };
    }
}
