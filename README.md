# VidNote Vault

> Your personal, offline YouTube knowledge base.

VidNote Vault is a privacy-focused, client-side application that helps you organize YouTube videos and take timestamped notes. It runs entirely in your browser using LocalStorage—no backend, no accounts, no tracking.

## Tech Stack

*   **Framework:** React + Vite
*   **Styling:** Tailwind CSS + shadcn/ui
*   **Persistence:** LocalStorage (Custom Hook/Repository Pattern)
*   **Video:** YouTube IFrame API
*   **Icons:** Lucide React

## Features

*   **Zero-Backend:** All data lives in your browser's LocalStorage.
*   **Smart Bookmarking:** Add videos by URL; auto-extracts IDs and thumbnails.
*   **Timestamped Notes:** Take notes while watching. Click a note to jump the video to that exact moment.
*   **Tagging & Organization:** Group videos by topics using a flexible tagging system.
*   **Full-Text Search:** Find any video or specific note content instantly.
*   **Data Backup:** Export your entire library to JSON for safekeeping.

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd vidnote-vault
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

## Documentation

*   [Task List](./TASKLIST.md) - Tracking development progress.
*   [Learnings](./LEARNINGS.md) - Technical decisions and solutions.
*   [Dev Rules](./.dev0/RULES.md) - Coding standards and guidelines.

## License

MIT