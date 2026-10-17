# Social Media Post Scheduler

A modern, responsive social media post management and scheduling dashboard built with React, TypeScript, and Tailwind CSS. Users can compose, preview, schedule, filter, and retry posts across multiple social channels (Facebook, Instagram, X, TikTok) from a single unified interface.

---

## Live Demo
- Live Application: [REPLACE_WITH_YOUR_VERCEL_URL]
- Source Code Repository: [REPLACE_WITH_YOUR_GITHUB_REPO_URL]

---

## Features Implemented

1. Chronological Day-Grouped Feed
   - Scheduled posts are intelligently categorized into Today, Tomorrow, and subsequent formatted calendar dates.
   - Stored ISO UTC timestamps are dynamically transformed to the user's browser local time zone.
   - Informative post cards display platform badges, scheduled time, content previews, media thumbnails, and status pills (scheduled, published, failed).

2. Persistent URL-Synced Filters & Search
   - Filter by status (all, scheduled, published, failed).
   - Filter by platform (all, x, instagram, tiktok, facebook).
   - Live text search matching post text content.
   - All filter parameters are two-way bound to browser URL query parameters (?status=...&platform=...&q=...) to survive full page reloads, browser history navigation, and direct bookmarking.

3. Post Composer & Platform-Specific Validation
   - Multi-platform selection support (choose one or many targets simultaneously).
   - Optional media URL input with real-time thumbnail preview.
   - Live character counter per selected platform:
     - X: 280 characters
     - Instagram: 2,200 characters
     - TikTok: 2,200 characters
     - Facebook: 5,000 characters
   - Strict guardrails: The schedule action is disabled if text length exceeds limits for any selected channel.
   - Date-time picker enforced with a future-only validation constraint.

4. Optimistic UI with Failure Simulation & Rollback
   - One-click retry action on failed posts.
   - Optimistically updates UI state to scheduled immediately upon click.
   - Simulates a 1-second asynchronous network latency followed by a 20% random failure rate (Math.random() < 0.20).
   - Automatically reverts state to failed with deep rollback and displays an informative error toast if the retry attempt fails.

5. Edge State Handling & Responsive Design
   - Seeded with 32+ realistic initial mock posts spanning various dates, platforms, and failure reasons (e.g., token expiration, rate limits).
   - Responsive design tailored for mobile, tablet, and desktop viewports.
   - Empty search results state and skeleton loading UI.

---

## Key Architectural Decisions

- Client-Side State with URL Synchronization:  
  Managed query params via native browser URLSearchParams and history APIs rather than transient React memory. This keeps the application bookmarkable and shareable without requiring external router bloat.
- Strict UTC Timestamp Invariant:  
  All post records store timestamps strictly in ISO 8601 UTC format (toISOString()). Formatting and presentation to human-readable local time occur solely at the view layer, eliminating multi-timezone drift.
- Optimistic UI Rollback Pattern:  
  Captured an immutable snapshot of the post item prior to triggering the async retry simulation. If the simulated network call fails, state cleanly rolls back to previous values without data corruption.
- Custom Tailwind Component System:  
  Built accessible, responsive UI elements purely using Tailwind CSS and Lucide icons rather than importing heavy UI component libraries, maintaining minimal bundle size and fast load times.

---

## Tech Stack

- Framework: React 19 + Vite
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Date Utilities: date-fns
- Feedback & Toasts: sonner

---

## Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation & Run

1. Clone the repository:
git clone [REPLACE_WITH_YOUR_GITHUB_REPO_URL]
cd social-scheduler

2. Install dependencies:
npm install

3. Start the local development server:
npm run dev
Open http://localhost:5173 in your browser.

4. Build for production:
npm run build