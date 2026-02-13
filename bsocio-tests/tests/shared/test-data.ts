/**
 * ============================================
 * Test Data Generators
 * ============================================
 * Dynamic test data factories for form inputs
 */

let counter = 0;

function unique(): number {
  return ++counter;
}

export function generateEmail(prefix = 'test'): string {
  return `${prefix}+${unique()}@bsocio-test.com`;
}

export function generateName(): { firstName: string; lastName: string } {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller'];
  return {
    firstName: firstNames[unique() % firstNames.length],
    lastName: lastNames[unique() % lastNames.length],
  };
}

// ── Form Data Builders ───────────────────────────────

export function buildSignupData() {
  return {
    email: generateEmail('signup'),
    gender: 'MALE',
    birthMonth: '05',
    birthDate: '15',
    birthYear: '1995',
    acceptTerms: true,
  };
}

export function buildContactData() {
  const { firstName, lastName } = generateName();
  return {
    fullName: `${firstName} ${lastName}`,
    email: generateEmail('contact'),
    reason: 'GENERAL_INQUIRY',
    country: 'US',
    phone: '+15551234567',
    message: 'This is a test contact form submission for E2E testing purposes.',
  };
}

export function buildLoginData(isAdmin = false) {
  return {
    email: isAdmin
      ? (process.env.TEST_ADMIN_EMAIL || 'admin@bsocio.com')
      : (process.env.TEST_USER_EMAIL || 'testuser@bsocio.com'),
    password: isAdmin
      ? (process.env.TEST_ADMIN_PASSWORD || 'Admin@123456')
      : (process.env.TEST_USER_PASSWORD || 'Test@123456'),
  };
}

export function buildNewsArticle() {
  const id = unique();
  return {
    title: `Test Article #${id}`,
    excerpt: `Summary for test article #${id}`,
    content: `<p>Content for test article #${id}</p>`,
    category: 'ANNOUNCEMENT',
  };
}

export function buildEvent() {
  const id = unique();
  const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
  return {
    title: `Test Event #${id}`,
    description: `Description for test event #${id}`,
    venue: 'Test Venue, Lagos',
    eventDate: start.toISOString().slice(0, 16),
  };
}

export function buildFAQ() {
  const id = unique();
  return {
    question: `Test FAQ Question #${id}?`,
    answer: `This is the answer to test FAQ question #${id}.`,
  };
}

export function buildAwardCategory() {
  const id = unique();
  return {
    name: `Test Category #${id}`,
    description: `Description for test award category #${id}`,
    icon: '🏆',
    color: '#FFD700',
  };
}

export function buildNominee() {
  const { firstName, lastName } = generateName();
  return {
    name: `${firstName} ${lastName}`,
    about: `Bio for ${firstName} ${lastName}. An outstanding community contributor.`,
    categoryId: 'cat-1',
  };
}

export function buildCampaign() {
  const id = unique();
  return {
    subject: `Test Campaign #${id}`,
    content: `<p>Campaign content for test #${id}</p>`,
    audienceType: 'ALL',
  };
}
