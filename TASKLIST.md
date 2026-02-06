# Task List

This file shows the current progress of all tasks in this project.
It is automatically updated by dev0 as tasks are completed.

---

## Phase 1

- [x] ✅ **Define Data Models and Types**
  Create a `types/index.ts` file to define the core data structures. We need interfaces for `Video` (id, youtubeId, title, url, tags, createdAt), `Note` (id, videoId, timestamp, content, createdAt), and the overall `Library` state. Ensure strict typing to prevent runtime errors later.

- [x] ✅ **Implement LocalStorage Repository**
  Create a `lib/storage.ts` utility. This should act as the 'database' layer. Implement functions to `getLibrary`, `saveVideo`, `deleteVideo`, `addNote`, and `deleteNote`. Include error handling for quota limits and Zod schema validation to ensure data read from localStorage is valid.

- [x] ✅ **Create Application Shell and Navigation**
  Build the main layout using a Sidebar layout (shadcn/ui). Include a header with the app title and a sidebar for navigation (Library, Tags, Settings). Create the routing structure using React Router (or simple conditional rendering if single page).

## Phase 2

- [ ] ⏳ **Implement 'Add Video' Dialog**
  Create a Dialog component that accepts a YouTube URL. Implement a utility to extract the YouTube Video ID from various URL formats (shorts, standard, share links). On submit, create a new Video entry in localStorage. Use `noembed.com` or similar public oEmbed endpoint to fetch the video title automatically if possible, otherwise allow manual title entry.

- [x] ✅ **Build Video Grid Dashboard**
  Create the main dashboard view that lists saved videos. Use a Card component to show the thumbnail (standard YouTube thumbnail URL structure), title, and tags. Implement a 'Delete' action on the card.

- [x] ✅ **Integrate YouTube Player Component**
  Create a `VideoPlayer` component wrapping `react-youtube` or the native IFrame API. It must expose a `ref` or method to control playback (seekTo, getCurrentTime, pause) for parent components.

- [x] ✅ **Implement Timestamp Note Creation**
  Build the Note Input interface. This should sit next to or below the player. When the user focuses the input, pause the video. Include a button to 'Capture Timestamp' which grabs the current player time. Saving the note adds it to the `storage` associated with the video ID.

- [ ] ⏳ **Implement Note List and Seek Logic**
  Display the list of notes for the active video. Format the timestamp (e.g., 135s -> 02:15). When a note or its timestamp is clicked, use the Player reference to seek the video to that specific second.

## Phase 3

- [x] ✅ **Add Tagging System**
  Update the Add/Edit Video forms to support tags. Create a simple tag input component (enter to add). Update the Dashboard to allow filtering by clicking a tag.

- [ ] ⏳ **Implement Global Search**
  Add a search bar to the header. Implement a search function in `storage.ts` that filters videos by title and also searches within the content of attached notes. Display results in a unified list.

## Phase 4

- [x] ✅ **Data Export and Import**
  Add a Settings page. Implement 'Export Data' (downloads a JSON file of the localStorage state) and 'Import Data' (reads a JSON file, validates it, and replaces localStorage). This is crucial for a local-only app.

- [ ] ⏳ **UI Polish and Empty States**
  Add empty states for the library (e.g., 'No videos yet, add one!'). Add toast notifications for actions (Note saved, Video deleted). Ensure the player layout is responsive on mobile devices.

---

_Last updated by dev0 automation_
