# Project Learnings

This file tracks insights and learnings from agents working on this project.
Each agent updates this file after completing a task.

## Guidelines for Agents

When updating this file:
- Document edge cases you encountered
- Note errors you fixed and how
- Share tips that would help future agents
- Mention any important architectural decisions
- Keep entries concise but informative

## Format

Use this format when adding learnings:

```markdown
### Task: [Task Title]
- **Completed:** [Date]
- **Task ID:** [ID]
- **Learnings:**
  - [Learning 1]
  - [Learning 2]
  - [Learning 3]
```

---

## Learnings Log

### Task: Implement LocalStorage Repository
- **Completed:** 2026-02-05
- **Task ID:** 131630b0-8cda-4d10-a6c9-0dfd8df7bf60
- **Learnings:**
  - Used `zod` for robust validation of data retrieved from `localStorage`.
  - Implemented centralized `saveLibrary` function to handle `QuotaExceededError` consistently.
  - Designed `saveVideo` and `addNote` to handle both create and update operations based on ID existence.
  - Ensured that deleting a video also cleans up associated notes to prevent data leakage/orphaned records.

### Task: Allow E2B preview host in Vite config
- **Completed:** 2026-02-07
- **Task ID:** 20e03d89-4915-4e37-b5ce-e78eec7c205e
- **Learnings:**
  - Vite 6+ requires `server.allowedHosts` to be configured when the application is embedded in an iframe on a different domain (like E2B previews).
  - Adding `".e2b.app"` to `allowedHosts` solves the "Blocked host" error when accessing the dev server through a proxy.
