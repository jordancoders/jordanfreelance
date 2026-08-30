# Run doc — Jordan Peters Coder Freelancing (Next.js)

## Reproduce the uncommitted artifacts a fresh checkout needs

- **Env files**: `.env` and `.env.local` are required by the app (MongoDB URI,
  admin PIN, Resend key). Copy them from the main checkout
  (`C:\Users\jim\Desktop\portfolio`) — this thread's workspace IS the main
  checkout, so nothing needs copying here. A fresh worktree must copy both
  files (never commit or symlink them).
- **Dependencies**: `npm install` (package manager is npm — see
  `package-lock.json`). `node_modules` must be present before running dev.
- **No build step required** for `npm run dev`; a production preview would need
  `npm run build && npm run start`.

## Run the server

- Start the dev server detached on the project's default port **3000**:

  ```powershell
  powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -WorkingDirectory 'C:\Users\jim\Desktop\portfolio' -RedirectStandardOutput 'C:\Users\jim\Desktop\portfolio\.freebuff\preview-6be17ea0-0bbc-420a-8a65-ce275f2c9724.log' -RedirectStandardError 'C:\Users\jim\Desktop\portfolio\.freebuff\preview-6be17ea0-0bbc-420a-8a65-ce275f2c9724.log.err' -WindowStyle Hidden -PassThru).Id"
  ```

- If port 3000 is taken, Next.js will pick a random port — read the log for the
  printed URL and register that instead.
- Confirm the process is alive and the URL answers HTTP 200 before registering
  the preview:
  `curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000/`
- **Do not use port 61254** — that is the Freebuff orchestrator's own server.
