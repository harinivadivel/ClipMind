# ClipMind AI — Deployment Guide

Frontend (React + Vite, on **Vercel**) → Backend (FastAPI + FFmpeg + Whisper, Docker, on **Render**) → PostgreSQL (managed).

```text
Vercel React frontend
        │  HTTPS API calls (VITE_API_URL)
        ▼
Render Docker backend  ──>  Managed PostgreSQL
```

---

## 1. Run locally with Docker (optional, dev)

```powershell
cd "D:\ClipMind AI\backend"
docker compose up --build -d
```

* API docs: <http://localhost:8000/docs>
* Health: <http://localhost:8000/health>
* PostgreSQL: `docker exec -it clipmind-postgres psql -U postgres -d clipmind_ai`
* Stop: `docker compose down` (add `-v` only if you want to wipe volumes)

Requires Docker Desktop for Windows (WSL2). First build is large (PyTorch/Whisper).

---

## 2. Deploy the Docker backend to Render

### Option A — Blueprint (recommended, `render.yaml` is in this repo)

1. Push this repo to GitHub.
2. Render dashboard → **New → Blueprint** → connect the GitHub repo.
3. Render creates:
   - **Managed PostgreSQL** (`clipmind-postgres`), with `DATABASE_URL` wired automatically.
   - **Web service** (`clipmind-backend`, Docker) from `backend/Dockerfile`.
4. In the Render dashboard set the two secrets (they are created with `sync: false`):
   - `SECRET_KEY` → a long random string (e.g. from `openssl rand -hex 32`).
   - `GOOGLE_API_KEY` → your Gemini key (optional; quizzes stay disabled without it).
5. Replace the backend URL placeholder in the **Environment** tab:
   - `BACKEND_CORS_ORIGINS` → `https://clip-mind-frontend.vercel.app`
   - `BACKEND_URL` → `https://<your-backend>.onrender.com`

### Option B — Manual

Render dashboard → **New → Web Service** → connect repo → **Runtime: Docker**,
Dockerfile path `./backend/Dockerfile`, **Health Check Path `/health`**, then add
a separate **New → PostgreSQL** and set the same env vars as in `render.yaml`.

> **Note:** uploaded videos live on the persistent disk (`/var/data`). Extracted
> audio and thumbnails are currently written to the container's ephemeral
> filesystem — they regenerate on demand. Moving media to **S3** is the
> recommended next step for production.

---

## 3. Point the Vercel frontend at the deployed API

The frontend already reads `import.meta.env.VITE_API_URL` (`frontend/src/services/api.js`),
so no code change is needed — you only set an environment variable.

1. Vercel dashboard → your project → **Settings → Environment Variables**.
2. Add `VITE_API_URL` = `https://<your-backend>.onrender.com`
3. Enable it for **Production**, **Preview**, and **Development**.
4. **Deployments → Redeploy** (or push a commit). Vite env vars are baked in at
   build time, so a redeploy is mandatory.

Local fallback: `frontend/.env` already contains `VITE_API_URL=http://localhost:8000`
(see `frontend/.env.example`).

---

## 4. CORS

The backend reads `BACKEND_CORS_ORIGINS` (alias `CORS_ORIGINS` also works) from
the environment — either a comma-separated list or a JSON array
(`app/core/config.py`). It already includes your Vercel origin:

```text
BACKEND_CORS_ORIGINS=https://clip-mind-frontend.vercel.app
```

If you see `CORS policy: No 'Access-Control-Allow-Origin'` in the browser,
this variable is missing/mismatched on Render.

---

## 5. Verify

* <https://your-backend.onrender.com/docs> → Swagger loads
* <https://your-backend.onrender.com/health> → `{"status": "healthy", ...}`
* In the deployed Vercel app, open **DevTools → Network** and:
  * Login / upload / summarize — requests must go to `https://<your-backend>.onrender.com/api/...`
  * Thumbnails and the video player must load `.../uploads/...` from the
    **backend** origin (handled by `resolveMediaUrl` in `frontend/src/utils/mediaUrl.js`).

---

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Requests still go to `localhost:8000` | `VITE_API_URL` not set on Vercel, or old build — redeploy. |
| `.../api/api/auth/login 404` (doubled `/api`) | Old frontend bundle — the `api.js` fix (same-origin fallback) isn't deployed yet. Push + redeploy. |
| `Unexpected token '<'` / HTML in JSON | Request hit the frontend origin — `VITE_API_URL` is unset or points at the wrong URL. |
| `No 'Access-Control-Allow-Origin'` | `BACKEND_CORS_ORIGINS` missing your Vercel URL on Render. |
| `502 Bad Gateway` | Backend crashed at startup — check Render logs; DB not reachable or pip build failed. |
| `404 Not Found` on API calls | Backend URL/path mismatch; all routes are under `/api/...`. |
| Blank thumbnails / broken player on Vercel | Old frontend build without `resolveMediaUrl` — redeploy. |
| `401 Unauthorized` | Stale JWT; log out/in. Tokens expire (default 30 min). |
| Whisper/quiz slow or failing | First run downloads models/corpora; needs outbound internet + time. |

---

## Known limitations & next steps

* **Alembic** — `main.py` uses `Base.metadata.create_all()` at startup. For
  schema changes (you've hit `column ... does not exist` before), adopt Alembic
  so production migrations are controlled.
* **S3/object storage** — video files are currently on Render's disk; move them
  to S3 for durability and scale.
* **Secrets** — `backend/.env` and `frontend/.env` are gitignored and excluded
  from the Docker image (`.dockerignore`). Rotate `SECRET_KEY` and the Gemini key
  if they were ever committed/shared.
