# App1 - Todo App Frontend (React)

## Tech Stack
- React 18
- React Router DOM
- Axios
- Vite

## Setup

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm install
npm run build
```

### Deploy to EC2
```bash
npm run build
sudo cp -r dist/* /var/www/app1/frontend/
```

## Environment
The frontend proxies `/api` requests to `http://localhost:3000` in development (via vite.config.js).

In production, Nginx handles the routing:
- `/` → serves React static files
- `/api/` → proxies to backend on port 3000
