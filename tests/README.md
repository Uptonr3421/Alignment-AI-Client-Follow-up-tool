# Tests

Test suite for the LGBTQ Center Client Automation system.

## Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data
```

## Running Tests

```bash
# All tests
npm run test

# Unit only
npm run test:unit

# Integration only
npm run test:integration

# E2E only
npm run test:e2e
```

## Test Data

Use fixtures in `fixtures/` for consistent test data:
- `clients.json` - Sample client records
- `templates.json` - Email templates
- `settings.json` - Configuration

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { calculateEmailSchedule } from '../src/shared/email';

describe('Email Schedule', () => {
  it('calculates welcome email for immediate send', () => {
    const result = calculateEmailSchedule(new Date());
    expect(result.welcome.scheduledAt).toBeDefined();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can add a client', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Add Client');
  await page.fill('[name=firstName]', 'Jane');
  await page.click('text=Save');
  await expect(page.locator('text=Jane')).toBeVisible();
});
```

## CI/CD

Tests run automatically on:
- Every pull request
- Every push to main
- Before release builds
