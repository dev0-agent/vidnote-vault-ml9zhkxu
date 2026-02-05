# dev0 Project Rules

This file defines the tech stack standards and coding conventions for this project.
**All agents must follow these rules when implementing tasks.**

---

## Tech Stack Standards

### Authentication
- **Library:** Better Auth
- **Strategy:** Email/password by default
- **Session:** JWT tokens
- **Location:** `src/lib/auth.ts`

### Database
- **ORM:** Drizzle
- **Database:** PostgreSQL
- **Schema Location:** `src/db/schema.ts`
- **Migrations:** `bun run db:migrate`
- **Query Patterns:** Use Drizzle query builder, avoid raw SQL

### State Management
- **Server State:** TanStack Query
- **Client State:** Zustand (if needed)
- **Form State:** React Hook Form + Zod validation

### Styling
- **Framework:** Tailwind CSS
- **Components:** shadcn/ui
- **Icons:** Lucide React
- **Custom Styles:** Add to `src/styles/globals.css`

### Testing
- **Framework:** Vitest
- **E2E:** Playwright (if needed)
- **Coverage:** Aim for 80%+ on critical paths

---

## Code Style Guidelines

### General
- Use TypeScript for all code
- Prefer `type` over `interface`
- Use functional components: `const Component = () => {}`
- Never use classes; prefer functional/declarative patterns
- Use descriptive variable names with auxiliary verbs (`isLoading`, `hasError`)

### File Organization
- Directory names: lowercase with dashes (`user-profile`)
- Component files: PascalCase (`UserProfile.tsx`)
- Use named exports for components
- Structure: exported component, subcomponents, helpers, static content, types

### Path Aliases
- Use `@/` alias for imports from `src/`
- Example: `import { Button } from '@/components/ui/button'`

### Comments
- Use comments sparingly
- Don't excessively comment every code block
- Focus on "why" not "what"

### React + Vite Specific

- **Routing:** Use React Router v7
- **Environment Variables:** Prefix with `VITE_` for client access
- **Assets:** Import images/files directly
- **Code Splitting:** Use `React.lazy()` for route-based splitting

---

## Task Completion Checklist

Before creating a PR, ensure:

1. ✅ **Tests Pass:** Run `bun test` and ensure all tests pass
2. ✅ **Type Safety:** Run `bun run typecheck` (or `bun run tsc`) with no errors
3. ✅ **Code Quality:** Follow all style guidelines above
4. ✅ **Update LEARNINGS.md:** Add any reusable insight or non-obvious fix you discovered
5. ✅ **Commit Message:** Write clear, descriptive commit messages

---

## Important Notes

- 🚨 **Always run tests before creating a PR**
- 📝 **Update LEARNINGS.md only when you discover a reusable insight or non-obvious fix**
- 🧩 **Keep components small and focused (single responsibility)**
- 🔒 **Never commit secrets or API keys**
- 📚 **Reference LEARNINGS.md for past solutions to common issues**

---

_This file is maintained by dev0 and should not be manually edited by agents._
