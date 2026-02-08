# Dev0 Platform Template Configuration Guide

## Overview
This configuration ensures:
- ✅ **Type checking works** - Agents can run `npm run typecheck` to see errors
- ✅ **Builds never block** - `npm run build` and `npm run dev` always succeed
- ✅ **Preview always works** - e2b iframe shows the app even with type errors

## Files to Copy to ALL Templates

### 1. tsconfig.app.json
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,        // ← Replaces verbatimModuleSyntax
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,                          // ← Still strict for type safety
    "noUnusedLocals": false,                 // ← Allow unused vars (AI friendly)
    "noUnusedParameters": false,             // ← Allow unused params (AI friendly)
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": false,   // ← Allow any imports
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**Key Changes:**
- ❌ Removed `"verbatimModuleSyntax": true` - This was causing import errors
- ✅ Added `"isolatedModules": true` - Better for Vite bundling
- ✅ Set `noUnusedLocals` and `noUnusedParameters` to `false` - AI agents won't be blocked

### 2. package.json scripts section
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",           // ← No tsc before build!
    "typecheck": "tsc -b",           // ← Separate command for type checking
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

**Key Changes:**
- ❌ Before: `"build": "tsc -b && vite build"` - Build would fail on type errors
- ✅ After: `"build": "vite build"` - Build always succeeds
- ✅ Added: `"typecheck": "tsc -b"` - Agents can check types separately

## How Code Agents Should Use This

### During Development (Finding Issues)
```bash
# Agent runs this to see type errors
npm run typecheck

# Output shows errors agent can fix:
# src/components/add-video.tsx(10,5): error TS2322: Type 'string' is not assignable to type 'number'
```

### For Preview (Never Blocks)
```bash
# Agent runs this for e2b preview
npm run dev
# OR
npm run build

# ✓ Always succeeds and shows preview in iframe
```

## Workflow for Code Agents

```
1. Agent writes code
2. Agent runs: npm run typecheck
   - If errors: Fix them and repeat
   - If no errors: Continue
3. Agent runs: npm run build (or dev)
   - Always succeeds (even if step 2 had errors)
   - Preview shows in iframe
```

## Migration Checklist

For each template repository:

- [ ] Replace `tsconfig.app.json` with the version above
- [ ] Update `package.json` scripts section
- [ ] Test both commands work:
  - [ ] `npm run typecheck` - Shows type errors
  - [ ] `npm run build` - Succeeds despite errors
  - [ ] `npm run dev` - Starts successfully
- [ ] Commit and push template updates

## Benefits

### For Code Agents
- Can still see and fix type errors via `npm run typecheck`
- Won't be blocked by minor issues during preview
- Clearer separation: check types vs. run app

### For Dev0 Platform
- Preview always works (no more blank pages)
- Users can see the app even if there are type issues
- Faster iteration (no build blocking)

### For Development Quality
- Still maintains `"strict": true` for type safety
- Still catches fall-through cases and real bugs
- Optional strict checking via `npm run typecheck`

## Important Notes

1. **Don't remove TypeScript entirely** - It's still useful for type checking
2. **`npm run typecheck` is optional** - Agents can skip if in a hurry
3. **Vite will still catch real errors** - Like missing files, syntax errors
4. **This works with any Vite + React + TypeScript template**

## Testing This Configuration

Run these commands to verify:
```bash
# Should show type errors (if any)
npm run typecheck

# Should succeed regardless of type errors
npm run build

# Should start dev server successfully
npm run dev
```

---

**Last Updated:** 2026-02-07  
**Configuration Version:** v2.0 (AI-Friendly + Type Checking)
