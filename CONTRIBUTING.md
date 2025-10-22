# Contributing to AIAS Platform

Thank you for your interest in contributing to the AIAS Platform! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- pnpm 8.0.0 or higher
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/aias-platform.git
   cd aias-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   pnpm run db:push
   pnpm run db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm run dev
   ```

## Contributing Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
pnpm run lint

# Run type checking
pnpm run typecheck

# Run tests
pnpm run test

# Run E2E tests
pnpm run test:e2e
```

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in component"
git commit -m "docs: update README"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Prefer functional components over class components
- Use hooks for state management

### React

- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Use TypeScript for prop types
- Implement proper loading and error states

### CSS/Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use CSS variables for theming
- Implement dark mode support
- Follow accessibility guidelines

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── integrations/       # Third-party integrations
```

## Testing

### Unit Tests

- Write tests for all new functionality
- Use Vitest for unit testing
- Aim for high test coverage
- Test both happy path and edge cases

### Integration Tests

- Test component interactions
- Test API integrations
- Test user workflows

### E2E Tests

- Use Playwright for E2E testing
- Test critical user journeys
- Test across different browsers
- Test responsive design

### Running Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:coverage
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the coding standards
- [ ] All tests pass
- [ ] No linting errors
- [ ] TypeScript compilation succeeds
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format

### PR Template

When creating a pull request, please include:

1. **Description**: What changes were made and why
2. **Type**: feat, fix, docs, style, refactor, test, chore
3. **Testing**: How the changes were tested
4. **Screenshots**: If applicable
5. **Breaking Changes**: If any
6. **Related Issues**: Link to related issues

### Review Process

1. Automated checks must pass
2. At least one reviewer approval required
3. All conversations must be resolved
4. No merge conflicts

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, etc.)

### Feature Requests

When requesting features, please include:

- Clear description of the feature
- Use case and motivation
- Proposed solution (if any)
- Alternatives considered

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority
- `priority: medium`: Medium priority
- `priority: low`: Low priority

## Development Guidelines

### Git Workflow

1. Always work on feature branches
2. Keep commits atomic and focused
3. Use descriptive commit messages
4. Rebase before merging
5. Squash commits when appropriate

### Code Review

- Be constructive and respectful
- Focus on the code, not the person
- Suggest improvements, don't just criticize
- Ask questions if something is unclear
- Approve when you're confident in the changes

### Performance

- Consider performance implications
- Use React.memo when appropriate
- Implement proper loading states
- Optimize images and assets
- Monitor bundle size

### Security

- Never commit secrets or credentials
- Use environment variables for configuration
- Validate all user inputs
- Follow security best practices
- Report security issues privately

## Getting Help

- Check existing issues and discussions
- Join our community discussions
- Contact maintainers for urgent issues
- Read the documentation thoroughly

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to AIAS Platform! 🚀