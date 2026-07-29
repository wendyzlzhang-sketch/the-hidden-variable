# The-Hidden-Variable

An interactive behavioral economics laboratory exploring how incentives,
psychological biases, identity, and personal values shape decisions under
uncertainty.

## Local development

Requirements: Node.js 20.9 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a Git repository.
2. Import the repository at Vercel.
3. Keep the detected framework as Next.js.
4. Deploy. No environment variables or external services are required.

The project uses the Next.js App Router under `src/app`. Experiment responses
remain in browser memory and are not transmitted or persisted.
