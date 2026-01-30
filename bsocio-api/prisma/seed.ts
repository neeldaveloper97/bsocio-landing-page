import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding admin users...\n');

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
    console.log('✅ Super Admin created:', superAdmin.email);

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
    console.log('✅ Content Admin created:', contentAdmin.email);

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
    console.log('✅ Communications Admin created:', commsAdmin.email);

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
    console.log('✅ Analytics Viewer created:', analyticsViewer.email);

    console.log('\n🎉 Seeding completed!\n');
    console.log('📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Email: superadmin@bsocio.com');
    console.log('  Password: SuperAdmin123!');
    console.log('');
    console.log('Content Admin:');
    console.log('  Email: content@bsocio.com');
    console.log('  Password: ContentAdmin123!');
    console.log('');
    console.log('Communications Admin:');
    console.log('  Email: communications@bsocio.com');
    console.log('  Password: CommsAdmin123!');
    console.log('');
    console.log('Analytics Viewer:');
    console.log('  Email: analytics@bsocio.com');
    console.log('  Password: Analytics123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Remember to change these passwords in production!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
