import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {

    // Super Admin
    const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@bsocio.com' },
        update: {},
        create: {
            id: randomUUID(),
            email: 'superadmin@bsocio.com',
            password: superAdminPassword,
            role: Role.SUPER_ADMIN,
            dob: new Date('1990-01-01'),
            isTermsAccepted: true,
            isPermanentUser: true,
        },
    });

    // Content Admin
    const contentAdminPassword = await bcrypt.hash('ContentAdmin123!', 10);
    const contentAdmin = await prisma.user.upsert({
        where: { email: 'content@bsocio.com' },
        update: {},
        create: {
            id: randomUUID(),
            email: 'content@bsocio.com',
            password: contentAdminPassword,
            role: Role.CONTENT_ADMIN,
            dob: new Date('1992-01-01'),
            isTermsAccepted: true,
            isPermanentUser: true,
        },
    });

    // Communications Admin
    const commsAdminPassword = await bcrypt.hash('CommsAdmin123!', 10);
    const commsAdmin = await prisma.user.upsert({
        where: { email: 'communications@bsocio.com' },
        update: {},
        create: {
            id: randomUUID(),
            email: 'communications@bsocio.com',
            password: commsAdminPassword,
            role: Role.COMMUNICATIONS_ADMIN,
            dob: new Date('1993-01-01'),
            isTermsAccepted: true,
            isPermanentUser: true,
        },
    });

    // Analytics Viewer
    const analyticsPassword = await bcrypt.hash('Analytics123!', 10);
    const analyticsViewer = await prisma.user.upsert({
        where: { email: 'analytics@bsocio.com' },
        update: {},
        create: {
            id: randomUUID(),
            email: 'analytics@bsocio.com',
            password: analyticsPassword,
            role: Role.ANALYTICS_VIEWER,
            dob: new Date('1994-01-01'),
            isTermsAccepted: true,
            isPermanentUser: true,
        },
    });
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
