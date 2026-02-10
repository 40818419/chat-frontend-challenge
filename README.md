# Doodle Frontend Challenge

A real-time chat UI built with Next.js, React Query, and Tailwind CSS. The application provides a messaging interface with automatic polling for new messages, deduplication, and a clean component architecture.

## Tech Stack

| Dependency                   | Version  |
| ---------------------------- | -------- |
| Next.js                      | 16.1.6   |
| React                        | 19.2.3   |
| @tanstack/react-query        | 5.90.20  |
| date-fns                     | 4.1.0    |
| clsx                         | 2.1.1    |
| Tailwind CSS                 | 4.x      |
| TypeScript                   | 5.x      |
| Vitest                       | 4.0.18   |
| @testing-library/react       | 16.3.2   |
| jsdom                        | 28.0.0   |

## Project Structure

```
app/
  layout.tsx                       # Root layout with font config
  page.tsx                         # Home page rendering the chat
  providers.tsx                    # React Query provider wrapper
  types.ts                         # Shared types (Message, CreateMessageBody)
  api/
    messages/
      route.ts                     # Next.js API route (GET + POST proxy)
  components/
    chat/
      Container.tsx                # Orchestrates History and Form
      History.tsx                  # Renders a list of Bubbles
      Bubble.tsx                   # Individual message bubble
      Form.tsx                     # Message input with validation and status feedback
    ui/
      Button.tsx                   # Reusable button primitive
      Input.tsx                    # Reusable input primitive
      Card.tsx                     # Card wrapper component
      Block.tsx                    # Layout block component
  hooks/
    useMessages.ts                 # Fetch, poll, deduplicate, and send messages
  service/
    api.ts                         # Client-side API layer (GET/POST)
  utils/
    deduplicateMessages.ts         # Message deduplication logic
    author.ts                      # Author-related utilities
```

Spec files (`*.spec.ts` / `*.spec.tsx`) are co-located next to their source files.

## Architecture Overview

### API Proxy

The Next.js API route at `app/api/messages/route.ts` acts as a server-side proxy to the backend. It forwards `GET` and `POST` requests to the backend API and injects the `Authorization: Bearer <token>` header server-side, keeping the auth token out of the browser.

Supported query parameters for `GET`: `limit`, `after`, `before`.

### Client API Layer

`app/service/api.ts` exposes an `API` object with `get()` and `post()` methods that call the Next.js proxy route (`/api/messages`). These methods handle URL parameter construction, error checking, and JSON parsing.

### useMessages Hook

`app/hooks/useMessages.ts` is the central data layer. It uses React Query to:

1. **Fetch** the initial message list via `useQuery`.
2. **Poll** for new messages every 3 seconds using a second query keyed with `['messages', 'poll']`, fetching only messages created after the last known timestamp.
3. **Deduplicate** incoming poll results against existing messages before merging them into the cache.
4. **Send** new messages via `useMutation`, invalidating the message cache on success.

### Chat Components

- **Container** -- orchestrates the chat UI by composing History and Form, passing data and handlers from `useMessages`.
- **History** -- renders a scrollable list of Bubble components.
- **Bubble** -- displays a single message with author, content, and formatted timestamp.
- **Form** -- handles message input with validation and status feedback for pending/error states.

### UI Primitives

Reusable, styled components used across the application: **Button**, **Input**, **Card**, and **Block**. Styling uses Tailwind CSS with `clsx` for conditional class merging.

## Prerequisites

- **Node.js** >= 20
- **pnpm** (package manager)
- **Backend API** running on port 3000 (the service this frontend proxies to)

## Getting Started

1. **Set up environment variables**

   Copy the example file and adjust values if needed:

   ```bash
   cp .env.example .env
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm dev
   ```

   The app runs at [http://localhost:3001](http://localhost:3001).

## Available Scripts

| Script             | Command                  | Description                         |
| ------------------ | ------------------------ | ----------------------------------- |
| `pnpm dev`         | `next dev --port=3001`   | Start the dev server on port 3001   |
| `pnpm build`       | `next build`             | Create a production build           |
| `pnpm start`       | `next start`             | Run the production server           |
| `pnpm lint`        | `eslint`                 | Run ESLint                          |
| `pnpm test`        | `vitest`                 | Run tests in watch mode             |
| `pnpm test:coverage` | `vitest --coverage`    | Run tests with coverage report      |

## Testing

Tests use **Vitest** with **React Testing Library** and **jsdom** as the browser environment. The `@` path alias is configured in `vitest.config.ts` to resolve to the project root.

Spec files are co-located next to their source files (e.g., `Button.spec.tsx` next to `Button.tsx`).

Run the full test suite:

```bash
pnpm test
```

Generate a coverage report (powered by `@vitest/coverage-v8`):

```bash
pnpm test:coverage
```

## Environment Variables

| Variable              | Scope        | Description                                                        |
| --------------------- | ------------ | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Client + Server | Base URL of the backend API. Defaults to `http://localhost:3000`. |
| `API_TOKEN`           | Server only  | Bearer token injected by the API route when proxying requests to the backend. Never exposed to the browser. |
| `NEXT_PUBLIC_POLLING_INTERVAL` | Client + Server | Polling interval in milliseconds for fetching new messages. Defaults to `3000`. |
