# Developer Assessment Coding Platform — Frontend

The web application for the Developer Assessment Coding Platform. Candidates use it to register, manage their profile, accept assessment invitations, and complete assessments. Recruiters can create assessments, manage questions, invite candidates, and review reports. Administrators can manage platform users and view administrative reports.

The frontend is built with Next.js App Router and communicates with the [backend API](https://github.com/Afsana-Jannat/assessment-coding-platform).

## Features

- Email and password registration and login, with optional Google sign-in.
- Role-based workspaces for candidates, recruiters, and administrators.
- Candidate profile and resume upload.
- Assessment creation, editing, publishing, and question management.
- Candidate assessment attempts, answer submission, and recruiter evaluation.
- Invitation management, reports, audit logs, and payment flows.

Some features require the corresponding backend integrations and provider credentials to be configured.

## Tech stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TanStack Query](https://tanstack.com/query/latest) and [TanStack Form](https://tanstack.com/form/latest)
- [ofetch](https://github.com/unjs/ofetch) for API requests
- [Biome](https://biomejs.dev/) for formatting and code checks

## Requirements

- Node.js 20.9 or later
- npm (the repository includes `package-lock.json`)
- Access to a running backend API

## Getting started

### 1. Install dependencies

```bash
npm ci
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` in the project root.

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS, Linux, or Git Bash:

```bash
cp .env.example .env.local
```

Set the values in `.env.local`:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | No | Backend origin, for example `http://localhost:5000`. The client appends `/api/v1` automatically. If omitted, the deployed backend URL is used. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Only for Google sign-in | Google OAuth client ID for the frontend. |

For local development, start the backend separately and set `NEXT_PUBLIC_API_BASE_URL` to its origin. Do not include `/api/v1` at the end of the value.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build locally; run `npm run build` first. |
| `npm run lint` | Check the project with Biome. |
| `npm run format` | Format project files with Biome. This command writes changes. |

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing home page |
| `/about-us` | About page |
| `/login` | Sign in |
| `/register` | Candidate registration |
| `/apply` | Candidate application/access page |
| `/dashboard` | Role-based workspace |
| `/Admin` | Administrative workspace |
| `/profile` | Candidate profile |
| `/assessments/[assessmentId]` | Assessment and question management |
| `/attempts/[attemptId]` | Candidate assessment attempt |
| `/reports` | Reports |
| `/payment/success` | Payment success return page |
| `/payment/cancel` | Payment cancellation return page |

## API integration

The API client is in `src/lib/apiClient.ts`. It uses `NEXT_PUBLIC_API_BASE_URL` as the backend origin and sends requests to its `/api/v1` path. Authentication tokens are stored in browser session storage, and requests include credentials for backend authentication cookies.

Production builds do not send API requests to loopback addresses such as `localhost` or `127.0.0.1`. If a loopback URL is configured in production, the client uses the deployed backend:

```text
https://developer-assessment-coding-platfor-phi.vercel.app
```

The backend repository documents the available API routes and required backend configuration.

## Production deployment

1. Deploy the backend and confirm its public API URL is reachable.
2. In the frontend hosting provider, configure `NEXT_PUBLIC_API_BASE_URL` with the backend **origin**, for example:

   ```text
   https://developer-assessment-coding-platfor-phi.vercel.app
   ```

3. If Google sign-in is enabled, configure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and allow the deployed frontend origin in the Google OAuth client settings.
4. Deploy or redeploy the frontend.

`NEXT_PUBLIC_` values are embedded into the client bundle at build time. Changing them in the hosting dashboard requires a new deployment. Configure backend credentials, allowed origins, and payment or file-upload provider settings in the backend deployment—not in the frontend.

## Troubleshooting

### Login or API requests fail with `Failed to fetch`

- Check that `NEXT_PUBLIC_API_BASE_URL` points to the deployed backend origin, not `http://localhost:5000`.
- Make sure the URL does not end with `/api/v1`; the frontend adds that path itself.
- Confirm the backend is deployed and responds at its public URL.
- Ensure the backend allows requests from the deployed frontend origin and supports credentialed CORS requests.
- Redeploy the frontend after changing environment variables.

### Login redirects or protected pages return an authorization error

- Confirm the account has the role required for the page or operation.
- Sign in again to refresh the session.
- Check that the backend is running and that its authentication cookie and token configuration matches the deployed environment.

### Google sign-in is unavailable

- Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in the frontend environment.
- Add the deployed frontend domain to the OAuth client's authorized JavaScript origins.
- Redeploy after changing the environment variable.

## Project structure

```text
src/
├── api/          API functions and response types
├── app/          App Router pages and global styles
├── components/   Shared UI, forms, and authentication components
├── lib/          API client and utilities
└── providers/    React context and query providers
```

## Contributing

Before submitting changes, run:

```bash
npm run lint
npm run build
```

Use the existing TypeScript, Biome, and component conventions in the project.
