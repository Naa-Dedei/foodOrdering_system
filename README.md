## Acity Café (HTML/CSS + JS + Backend API)

This project is a simple café site (`frontend/`) served by a small Node/Express backend (`backend/`) that also exposes API routes.

### Deployment links

- **Backend (Render)**: `https://foodordering-system-m85g.onrender.com`
- **Frontend (if deployed separately)**: `https://naa-dedei.github.io/foodOrdering_system/`
- **Repository**: `https://github.com/Naa-Dedei/foodOrdering_system.git`

### Run locally

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the site:

- Visit `http://localhost:3000/`

### Frontend dev (Live Server)

If you use VS Code Live Server (commonly `http://127.0.0.1:5500`), the frontend is configured to call the backend on `http://localhost:3000`.

### API routes

- `GET /api/health`: health check
- `GET /api/menu`: returns menu items used to populate the Order dropdown
- `POST /api/orders`: submit an order (JSON: `{ name, email, itemId, quantity }`)
- `GET /api/orders`: list stored orders (Postgres)

### Postgres (Render) setup

- **Set env var**: `DATABASE_URL` (Render “External Database URL`)
- **Create tables in pgAdmin** (you’ll paste your own SQL there). The backend expects these tables:
  - `menu_items`: `id`, `name`, `description`, `image_url`, `category`, `price_cents`, `is_active`
  - `orders`: `id`, `customer_name`, `customer_email`, `menu_item_id`, `quantity`, `unit_price_cents`, `created_at`

For local dev, you can set env vars in your terminal (recommended) or use a local `.env` file (don’t commit it).

### Render deployment notes (backend)

- **Start command**: `npm start`
- **Environment variables**:
  - `DATABASE_URL`: your Render Postgres External Database URL
  - `PORT`: (Render sets this automatically)
- After deploying, test:
  - `GET /api/health`
  - `GET /api/menu`

### Make DATABASE_URL “constant” on Windows (local)

Run this once (sets it persistently for your Windows user), then restart your terminal:

```powershell
cd E:\Amazing\end_of_sem_3\backend
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\set-db-url.ps1 -DatabaseUrl "<PASTE YOUR DATABASE URL>"
```

After that, `npm start` will work without re-setting `DATABASE_URL` each time.
