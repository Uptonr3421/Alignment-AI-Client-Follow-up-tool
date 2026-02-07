# Shared Types and Utilities

This package contains shared TypeScript types and utilities used across the desktop app, web frontend, and web backend.

## Contents

- `types.ts` - All TypeScript interfaces and types
- `validators.ts` (planned) - Validation functions
- `utils.ts` (planned) - Shared utility functions
- `constants.ts` (planned) - Application constants

## Usage

In other packages, import shared types like:

```typescript
import { Client, EmailTemplate, ClientStatus } from '@shared/types';
```

## Building

```bash
npm run build
```

This compiles TypeScript to JavaScript and generates type definitions.

## Development

```bash
npm run dev
```

Runs TypeScript in watch mode for development.
