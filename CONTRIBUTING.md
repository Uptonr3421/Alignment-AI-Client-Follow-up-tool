# Contributing to Cleveland LGBTQ Center Automation

Thank you for your interest in contributing! This project is a pro bono gift to the Cleveland LGBTQ Center, but we welcome contributions from anyone who wants to help improve it or adapt it for other nonprofits.

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples
- Describe the behavior you observed and what you expected
- Include screenshots if applicable
- Note your environment (OS, browser, app version)

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md).

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- List any alternative solutions you've considered

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

### Pull Requests

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Test** thoroughly
5. **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

## Development Setup

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **Rust** 1.70 or higher (for desktop app)
- **Git** 2.40 or higher

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool.git
cd Alignment-AI-Client-Follow-up-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration
```

### Running Locally

```bash
# Run web app in development mode
npm run dev:web

# Run desktop app in development mode
npm run dev:desktop

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Project Structure

```
src/
├── desktop/          # Tauri desktop application
│   ├── src/          # React frontend for desktop
│   └── src-tauri/    # Rust backend for desktop
├── web/              # Web application
│   ├── frontend/     # React frontend
│   └── backend/      # Express.js backend
└── shared/           # Shared TypeScript types and utilities
```

## Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use functional components with hooks in React
- Prefer `const` over `let`, avoid `var`
- Write meaningful comments explaining "why", not "what"

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new email template editor
fix: resolve database connection timeout
docs: update installation instructions
style: format code with prettier
refactor: simplify authentication logic
test: add unit tests for email service
chore: update dependencies
```

### Accessibility

- All UI components must meet WCAG 2.1 AA standards
- Include proper ARIA labels
- Ensure keyboard navigation works
- Test with screen readers when possible

### Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs
- Use parameterized queries for database access
- Sanitize all HTML outputs

## Testing

```bash
# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:unit -- --watch

# Check test coverage
npm run test:unit -- --coverage
```

## Documentation

When adding new features:

1. Update relevant documentation in `/docs`
2. Add JSDoc comments to public functions
3. Update README.md if user-facing
4. Include examples where helpful

## Questions?

- 📧 Email: [contact@alignment-ai.io](mailto:contact@alignment-ai.io)
- 🐛 Issues: [GitHub Issues](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make this project better for the Cleveland LGBTQ Center and other nonprofits! 💝**
