# Developer Assessment Coding Platform — Frontend

Next.js frontend for the Developer Assessment Coding Platform.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_BASE_URL` to the backend URL. The example defaults to a backend running at `http://localhost:5000`.
3. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` if Google sign-in is enabled.
4. Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000).

## Deployment

Set `NEXT_PUBLIC_API_BASE_URL` in the frontend hosting provider to the deployed backend origin:

```text
https://developer-assessment-coding-platfor-phi.vercel.app
```

`NEXT_PUBLIC_` variables are embedded into the browser bundle at build time, so redeploy the frontend after changing this setting. Production builds also refuse loopback API URLs and use the hosted backend instead; localhost remains available for local development.
