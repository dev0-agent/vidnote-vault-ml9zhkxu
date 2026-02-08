# Template Configuration for Dev0 Platform

This template is configured to be **lenient and forgiving** for AI-generated code, ensuring smooth previews even when code agents make minor mistakes.

## Changes Made for AI-Friendly Development

### 1. Build Script (package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",           // ← No TypeScript checking before build
    "typecheck": "tsc -b",           // ← Optional: Run manually if needed
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Why:** Vite's bundler is much more forgiving than TypeScript's strict checks. It will still catch runtime errors but won't block on type issues.

### 2. TypeScript Config (tsconfig.app.json)

**Removed:**
- ❌ `"verbatimModuleSyntax": true` - Was causing import errors
- ❌ `"erasableSyntaxOnly": true` - Too strict for AI code
- ❌ `"noUnusedLocals": true` - AI agents often leave unused vars
- ❌ `"noUnusedParameters": true` - AI agents often leave unused params
- ❌ `"noUncheckedSideEffectImports": true` - Too restrictive

**Added:**
- ✅ `"isolatedModules": true` - Ensures each file can be compiled independently
- ✅ Kept `"strict": true` - Still maintains type safety during development
- ✅ Kept `"noFallthroughCasesInSwitch": true` - Catches actual bugs

## What This Means for Your Dev0 Platform

### ✅ Benefits
1. **Builds will always succeed** (unless there are actual syntax errors)
2. **No more blank preview pages** due to import issues
3. **AI agents can be less careful** about type imports
4. **Faster development** - no TypeScript compilation step

### ⚠️ Trade-offs
1. Type errors won't be caught until runtime in the browser
2. You can still run `npm run typecheck` manually to see type issues
3. ESLint will still catch most common issues during development

## Best Practices for AI Agents

Even though the build is lenient, agents should still try to:

1. **Use type imports when possible:**
   ```typescript
   import type { Video, Note } from '@/types'  // Good
   import { Video, Note } from '@/types'       // Also works now
   ```

2. **Run builds to verify:**
   ```bash
   npm run build  # Will succeed even with type errors
   ```

3. **Optional: Run type checking for quality:**
   ```bash
   npm run typecheck  # Shows type errors but doesn't fail
   ```

## Troubleshooting

### If preview still shows blank page:
1. Check browser console for actual JavaScript runtime errors
2. Make sure all imports point to files that exist
3. Verify no syntax errors (missing brackets, etc.)

### If you want stricter checking:
1. Change build script back to: `"build": "tsc -b && vite build"`
2. Re-enable strict options in tsconfig.app.json

## Template Updates

To apply these changes to other templates:

1. Copy `tsconfig.app.json` from this project
2. Update `package.json` scripts section
3. Ensure all type imports use `type` keyword (optional but recommended)

---

**Last Updated:** 2026-02-07  
**Template Version:** Lenient AI-Friendly v1.0
