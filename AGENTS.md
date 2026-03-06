# AGENTS.md - Agentic Coding Guidelines

## Project Overview
- **Type**: React + TypeScript + Vite SPA
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS with dark mode support
- **Build Output**: Deploys to /kilo-gateway-models-explorer/ subdirectory
- **TypeScript**: Strict mode enabled

## Commands

### Development
```bash
pnpm dev          # Start Vite dev server
pnpm build        # Type-check and build for production
pnpm preview      # Preview production build locally
```

### Type Checking
```bash
tsc -b           # Run TypeScript compiler check
```

### Testing
**Note**: This project currently has no test suite. When adding tests, use Vitest:
```bash
pnpm vitest                  # Run all tests
pnpm vitest run             # Run tests once
pnpm vitest run <file>      # Run single test file
pnpm vitest --watch         # Watch mode
```

## Code Style Guidelines

### TypeScript Configuration
The project uses strict TypeScript mode. All code must pass type checking:
- `strict: true` - full strict mode enabled
- `noUnusedLocals: true` - no unused variables allowed
- `noUnusedParameters: true` - no unused parameters allowed
- `noFallthroughCasesInSwitch: true` - all switch cases must return/break

### Imports
- Use explicit named imports from React: `import { useState, useEffect } from 'react'`
- Group imports in order: React → external libraries → internal components/utils
- Use relative paths for local components: `./components/Header`
- Use relative paths for utils: `./utils/apiCache`
- Avoid barrel imports (index files) unless necessary

### Naming Conventions
- **Components**: PascalCase (e.g., `ModelCard.tsx`, `Header.tsx`)
- **Utilities**: camelCase (e.g., `apiCache.ts`, `modalityConfig.ts`)
- **Interfaces**: PascalCase with descriptive names (e.g., `ModelCardProps`)
- **Variables/Functions**: camelCase, avoid abbreviations except common ones (`ctx`, `mod`, `msg`)
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects

### Component Structure
Follow this pattern for React components:
```typescript
import React from 'react';
import { SomeUtility } from '../utils/someUtility';

interface ComponentNameProps {
  // Define all props with explicit types - no any
  title: string;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

export const ComponentName: React.FC<ComponentNameProps> = ({ 
  title, 
  onAction,
  isLoading = false 
}) => {
  // State hooks first
  const [state, setState] = useState<string>('');
  
  // Refs next
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Callbacks with useCallback
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);
  
  // Derived state with useMemo
  const processedData = useMemo(() => {
    return state.map(item => transform(item));
  }, [state]);
  
  // Effects after hooks
  useEffect(() => {
    // side effects
  }, [dependencies]);
  
  // Early returns for error/loading states
  if (isLoading) {
    return <Spinner />;
  }
  
  // Main render
  return (
    <JSX />
  );
};

export default ComponentName;
```

### Error Handling
- Use try-catch blocks for all async operations
- Always provide fallback values or UI states
- Log errors with descriptive messages: `console.error("Fetch failed:", err)`
- Handle localStorage gracefully with try-catch (can throw in private browsing)
- Never let errors propagate unhandled to the UI

### CSS/Tailwind Conventions
- Use Tailwind utility classes exclusively - no custom CSS unless necessary
- Follow dark mode pattern: `className="bg-white dark:bg-slate-900"`
- Use semantic color names: `text-slate-900 dark:text-white`, `text-primary`
- Use consistent spacing scale from Tailwind: `p-4`, `m-2`, `gap-3`
- Use responsive prefixes: `md:`, `lg:`, `xl:` for breakpoints
- Custom colors in tailwind.config.js: primary (#14b8a6), primary-light, primary-dark
- Use `glass-panel` class for frosted glass effect containers

### File Organization
```
src/
├── components/     # React components (PascalCase files)
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── ModelCard.tsx
│   └── Tooltip.tsx
├── utils/          # Utility functions (camelCase files)
│   ├── apiCache.ts
│   └── modalityConfig.ts
├── App.tsx         # Main application component
├── main.tsx       # Entry point
└── index.css      # Global styles and Tailwind
```

### State Management Patterns
- Use `useState` for local component state
- Use `useCallback` for all event handlers passed to child components
- Use `useMemo` for expensive computations and derived data
- Use `useEffect` only for side effects (data fetching, subscriptions, DOM manipulation)
- Use `React.useRef` for mutable refs that don't trigger re-renders
- Consider lifting state up when multiple components need the same data

### Type Definitions
- **Never use `any`** - always define proper types
- Use `interface` for object shapes and component props
- Use `type` for unions, intersections, and type aliases
- Define prop interfaces explicitly for all components
- Use generic types when creating reusable utilities
- Example: `function getCachedData<T>(key: string): T | null`

### Additional Guidelines
- No ESLint or Prettier configuration currently - consider adding for consistency
- Vite config includes React plugin with base path `/kilo-gateway-models-explorer/`
- Components should be functional with hooks, no class components
- Use Material Symbols icons via `<span className="material-symbols-outlined">`
- Target ES2020 with DOM support (see tsconfig.json)
- All components should support dark mode via `dark:` Tailwind classes

### Existing Code Patterns
- API data uses fallback mock data when fetch fails
- Cache uses localStorage with 1-hour TTL (3600000ms)
- Use Set for managing selected/filtered collections
- Dark mode respects system preference initially, then user choice
- Components use `React.FC` typing for type safety

## Cursor/Copilot Rules
No Cursor rules (`.cursor/rules/`) or Copilot rules (`.github/copilot-instructions.md`) exist in this repository.
