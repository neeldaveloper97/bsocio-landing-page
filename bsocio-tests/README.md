# BSocio Test Suite

Comprehensive Playwright test suite for the **BSocio Landing Page** and **BSocio Admin Panel** frontend applications.

## Project Structure

```
bsocio-tests/
├── playwright.config.ts        # Multi-project Playwright config
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config with path aliases
├── .env                        # Environment variables
├── .gitignore
│
└── tests/
    ├── shared/                 # Shared test utilities
    │   ├── fixtures.ts         # Custom Playwright fixtures (mockApi, etc.)
    │   ├── mock-data.ts        # Mock data for all entities
    │   ├── api-mocks.ts        # Full API route mocking helpers
    │   ├── auth-helpers.ts     # Auth cookie utilities
    │   └── test-data.ts        # Test data factories/builders
    │
    ├── bsocio/                 # BSocio Landing Page tests
    │   ├── e2e/                # End-to-end tests (14 spec files)
    │   │   ├── navigation.spec.ts
    │   │   ├── home.spec.ts
    │   │   ├── about.spec.ts
    │   │   ├── contact.spec.ts
    │   │   ├── faqs.spec.ts
    │   │   ├── festivals.spec.ts
    │   │   ├── how-it-works.spec.ts
    │   │   ├── leadership.spec.ts
    │   │   ├── news-media.spec.ts
    │   │   ├── our-structure.spec.ts
    │   │   ├── privacy.spec.ts
    │   │   ├── terms.spec.ts
    │   │   ├── signup.spec.ts
    │   │   └── error-pages.spec.ts
    │   │
    │   ├── integration/        # API integration tests (7 spec files)
    │   │   ├── faqs-api.spec.ts
    │   │   ├── festivals-api.spec.ts
    │   │   ├── news-api.spec.ts
    │   │   ├── legal-api.spec.ts
    │   │   ├── contact-form.spec.ts
    │   │   ├── signup-flow.spec.ts
    │   │   └── subscribe.spec.ts
    │   │
    │   └── snapshot/           # Visual regression tests
    │       └── pages.spec.ts   # Full-page screenshots (16 tests)
    │
    └── admin/                  # BSocio Admin Panel tests
        ├── e2e/                # End-to-end tests (13 spec files)
        │   ├── login.spec.ts
        │   ├── dashboard.spec.ts
        │   ├── news-crud.spec.ts
        │   ├── events-crud.spec.ts
        │   ├── faqs-crud.spec.ts
        │   ├── legal-editor.spec.ts
        │   ├── awards-crud.spec.ts
        │   ├── nominees-crud.spec.ts
        │   ├── guests-crud.spec.ts
        │   ├── campaigns.spec.ts
        │   ├── communications.spec.ts
        │   ├── users-management.spec.ts
        │   └── analytics.spec.ts
        │
        ├── integration/        # API integration tests (4 spec files)
        │   ├── auth-flow.spec.ts
        │   ├── dashboard-api.spec.ts
        │   ├── news-api.spec.ts
        │   └── crud-operations.spec.ts
        │
        └── snapshot/           # Visual regression tests
            └── pages.spec.ts   # Full-page screenshots (12 tests)

```

## Test Coverage

| Area | E2E | Integration | Snapshot | Total |
|------|-----|-------------|----------|-------|
| BSocio Landing Page | 14 files | 7 files | 1 file | 22 files |
| BSocio Admin Panel | 13 files | 4 files | 1 file | 18 files |
| **Total** | **27 files** | **11 files** | **2 files** | **40 files** |

### BSocio Landing Page Coverage

- **Navigation** – Header, mobile menu, footer link navigation
- **Home Page** – Hero section, CTA buttons, SEO meta tags, performance
- **About** – Content rendering, images, title
- **Contact** – Form validation, submission, API errors
- **FAQs** – Accordion expand/collapse, loading, error states
- **Festivals** – Award categories, nominees, events, special guests
- **How It Works** – Steps, images, SEO
- **Leadership** – Team member cards
- **News & Media** – Article list, detail pages, filters, newsletter
- **Our Structure** – Organizational content
- **Privacy / Terms** – Dynamic markdown rendering from API
- **Signup** – Form validation, submission, Google OAuth, email verification
- **Error Pages** – 404, back-to-home navigation

### BSocio Admin Panel Coverage

- **Authentication** – Login, token refresh, role-based access, logout
- **Dashboard** – Metrics, sidebar navigation, quick links
- **News CRUD** – List, create, edit, delete, archive, pagination
- **Events CRUD** – List, create, edit, delete, statistics
- **FAQs CRUD** – List, create, edit, delete, reorder
- **Legal Editor** – Privacy/Terms tabs, save, preview
- **Awards CRUD** – Categories management
- **Nominees CRUD** – Status badges, status transitions
- **Special Guests CRUD** – Full guest management
- **Campaigns** – Create, send, draft, audience selection
- **Communications** – Contact messages, status, filters
- **Users Management** – Admin CRUD, roles, status, export, activity logs
- **Analytics** – Metrics, charts, birthday calendar, CSV export

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- Both frontend apps must be available:
  - BSocio Landing Page at `http://localhost:3000`
  - BSocio Admin Panel at `http://localhost:3001`
- API server at `http://localhost:7000` (or tests will use mocked APIs)

## Installation

```bash
cd bsocio-tests
npm install
npx playwright install --with-deps
```

## Configuration

All configuration is in `.env`:

```env
BSOCIO_BASE_URL=http://localhost:3000
ADMIN_BASE_URL=http://localhost:3001
API_BASE_URL=http://localhost:7000
TEST_ADMIN_EMAIL=admin@bsocio.com
TEST_ADMIN_PASSWORD=Admin@123456
TEST_USER_EMAIL=testuser@bsocio.com
TEST_USER_PASSWORD=Test@123456
```

## Running Tests

### Run All Tests
```bash
npm test
```

### By Application
```bash
npm run test:bsocio        # All BSocio landing page tests
npm run test:admin          # All admin panel tests
```

### By Test Type
```bash
npm run test:e2e            # All E2E tests
npm run test:integration    # All integration tests
npm run test:snapshot       # All snapshot/visual tests
```

### By Browser
```bash
npx playwright test --project=bsocio-chromium
npx playwright test --project=bsocio-firefox
npx playwright test --project=bsocio-webkit
npx playwright test --project=bsocio-mobile
npx playwright test --project=admin-chromium
npx playwright test --project=admin-firefox
npx playwright test --project=admin-webkit
```

### Specific Test File
```bash
npx playwright test tests/bsocio/e2e/contact.spec.ts
npx playwright test tests/admin/e2e/login.spec.ts
```

### Headed Mode (see browser)
```bash
npx playwright test --headed
```

### Debug Mode
```bash
npx playwright test --debug
```

### UI Mode (interactive)
```bash
npx playwright test --ui
```

## Snapshot Tests

### Generate Baseline Screenshots
On first run, Playwright generates snapshots:
```bash
npm run test:snapshot
```

### Update Snapshots
```bash
npm run test:snapshot:update
```

Snapshot images are stored alongside the test files in `*-snapshots/` directories.

## Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports are generated at `playwright-report/`. Traces (for debugging failures) are stored at `test-results/`.

## Architecture

### API Mocking Strategy

Tests use Playwright's `page.route()` to intercept API calls:

- **E2E tests** mock all external API calls to ensure consistency
- **Integration tests** verify request payloads, headers, and method types
- **Snapshot tests** mock APIs to render consistent UI states

### Shared Utilities

| File | Purpose |
|------|---------|
| `fixtures.ts` | Extended Playwright `test` with `mockApi` / `mockApiError` fixtures |
| `mock-data.ts` | Comprehensive mock responses for all API endpoints |
| `api-mocks.ts` | `mockBsocioPublicApis()` and `mockAdminApis()` to mock all routes at once |
| `auth-helpers.ts` | Set/clear auth cookies for admin authenticated tests |
| `test-data.ts` | Factory functions to generate test data with unique values |

### Browser Matrix

| Project | Browser | Viewport |
|---------|---------|----------|
| bsocio-chromium | Chromium | 1280×720 |
| bsocio-firefox | Firefox | 1280×720 |
| bsocio-webkit | WebKit | 1280×720 |
| bsocio-mobile | Chromium (Pixel 5) | 393×851 |
| admin-chromium | Chromium | 1280×720 |
| admin-firefox | Firefox | 1280×720 |
| admin-webkit | WebKit | 1280×720 |

## CI/CD Integration

Add to your CI pipeline:

```yaml
# GitHub Actions example
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Tests
  run: npm test

- name: Upload Report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: playwright-report
    path: bsocio-tests/playwright-report/
```

## Troubleshooting

**Tests fail with connection refused:**
Ensure both frontend apps and the API are running before executing tests. The `playwright.config.ts` includes `webServer` config that attempts to start them automatically.

**Snapshot tests fail on different OS:**
Snapshots are platform-specific. Generate baseline on the same OS as CI. Use `maxDiffPixelRatio: 0.05` for tolerance.

**Auth tests redirect incorrectly:**
Verify the cookie domain matches your setup. The admin app uses `localhost` domain by default.
