# Tests

End-to-end and integration tests will be placed here.

## Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
│   ├── desktop/           # Desktop app E2E tests
│   └── web/               # Web app E2E tests
├── integration/           # Integration tests
│   ├── email/            # Email sending tests
│   └── database/         # Database integration tests
└── fixtures/             # Test data and fixtures
```

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e
```

## Writing Tests

Tests should cover:

- User workflows (adding clients, sending emails)
- Email automation triggers
- Database operations
- API endpoints
- Error handling
- Edge cases

See CONTRIBUTING.md for testing guidelines.
