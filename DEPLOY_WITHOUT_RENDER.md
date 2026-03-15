# Deploy TRINETRA Without Render

Use **Vercel** (frontend) + **Railway** (backend) instead of Render.

---

## 1. Deploy backend on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select your repo (e.g. `Kushal-prime/Disaster-Management`).
4. Railway will add one service. Open it and go to **Settings**:
   - **Root Directory**: set to `backend`
   - **Build Command**: `python -m pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. In **Variables**, add:
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app` (use your Vercel URL after step 2)
6. Under **Settings** → **Networking**, click **Generate Domain**. Copy the URL (e.g. `https://trinetra-api-production-xxxx.up.railway.app`).

---

## 2. Deploy frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New** → **Project** and import your repo.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables** add:
   - `REACT_APP_API_URL` = your Railway backend URL (e.g. `https://trinetra-api-production-xxxx.up.railway.app`)
   - `REACT_APP_WS_URL` = same URL but with `wss://` and path, e.g. `wss://trinetra-api-production-xxxx.up.railway.app/ws/live`
5. Click **Deploy**. Vercel will build and give you a URL (e.g. `https://your-app.vercel.app`).

---

## 3. Point backend to frontend

1. In **Railway** → your backend service → **Variables**, set:
   - `ALLOWED_ORIGINS` = `https://your-app.vercel.app` (your real Vercel URL)
2. Redeploy the backend so the new CORS origin is used.

---

## Summary

| Part     | Platform | URL / note |
|----------|----------|------------|
| Backend  | Railway  | Set Root Directory = `backend`, use generated domain |
| Frontend | Vercel   | Set Root Directory = `frontend`, set `REACT_APP_API_URL` and `REACT_APP_WS_URL` |

No Render account or `render.yaml` needed.
