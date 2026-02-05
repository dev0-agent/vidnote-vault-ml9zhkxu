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

### Task: Add Tagging System

- **Completed:** 2026-02-05

- **Task ID:** 3db34133-fe1b-4a73-be09-abc00fae6411

- **Learnings:**

  - Implemented a `TagInput` component that uses `Enter` to add and `Backspace` on empty input to remove tags.

  - Used `window.dispatchEvent(new CustomEvent("library-updated"))` to synchronize state across decoupled components (e.g., refreshing the dynamic tags list in the sidebar/tabs when a video is edited in the grid).

  - Leveraged `useMemo` in the root `App` component with a `libraryVersion` counter to efficiently recalculate the global list of unique tags from all videos.

  - Integrated tag filtering by simply setting the global `searchQuery` to the tag name when clicked, utilizing the existing search logic in `VideoGrid`.
