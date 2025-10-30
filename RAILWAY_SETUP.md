# Railway Deployment Guide - Full Stack Setup

This guide covers deploying both frontend and backend together on Railway.

## Architecture Overview

In production, both the Vite frontend and Next.js backend run on a **single Railway service**:
- Next.js serves the API routes at `/api/*`
- Next.js also serves the built Vite frontend (static files)
- Everything runs on the same origin (no CORS needed)

## Prerequisites

1. Railway account
2. MongoDB database (Railway MongoDB plugin or MongoDB Atlas)
3. Git repository connected to Railway

## Required Environment Variables

Configure these in your Railway service:

### 1. Database (Required)

Railway MongoDB plugin automatically provides `DATABASE_URL` or `MONGO_URL`. If using external MongoDB:

```bash
DATABASE_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 2. API URL (Optional)

The frontend **automatically detects production mode** and uses `/api` for same-origin API calls. You only need to set this if you want to override the default behavior:

```bash
VITE_API_URL=/api
```

**Default behavior:**
- **Production**: Uses `/api` (same origin)
- **Development**: Uses `http://localhost:3001/api` (separate servers)

### 3. Node Environment (Automatic)

Railway automatically sets:

```bash
NODE_ENV=production
```

### 4. Port (Automatic)

Railway automatically provides:

```bash
PORT=<dynamic-port>
```

## Deployment Configuration

The project includes pre-configured files:

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"

[variables]
NODE_ENV = "production"
```

## Build Process

When you deploy, Railway will:

1. **Install dependencies**: `npm ci`
2. **Build frontend**: `vite build` → outputs to `public/` folder
3. **Build backend**: `next build` → builds Next.js API routes
4. **Start server**: `next start -p $PORT`

The Next.js server will:
- Serve API routes at `/api/*`
- Serve static frontend files from `public/` folder
- Handle SPA routing (all non-API routes → `index.html`)

## Step-by-Step Deployment

### 1. Create Railway Project

```bash
# Install Railway CLI (optional)
npm i -g @railway/cli

# Login
railway login

# Create new project
railway init
```

Or use the Railway dashboard: https://railway.app

### 2. Add MongoDB Database

**Option A: Railway MongoDB Plugin (Recommended)**
1. Go to your project dashboard
2. Click "New" → "Database" → "Add MongoDB"
3. Railway automatically sets `DATABASE_URL`

**Option B: MongoDB Atlas**
1. Create a cluster at https://cloud.mongodb.com
2. Get connection string
3. Add as environment variable: `DATABASE_URL=mongodb+srv://...`

### 3. Configure Environment Variables

The only **required** environment variable is the database connection (automatically set by Railway MongoDB plugin).

**Optional variables** (usually not needed):
- `VITE_API_URL=/api` - Only if you want to explicitly set it (auto-detected by default)
- `PORT` - Railway sets this automatically

### 4. Deploy

```bash
git push
```

Railway will automatically detect changes and deploy.

## Verifying Deployment

After deployment, check:

1. **API Health**: Visit `https://your-app.railway.app/api/clientes` (should return JSON)
2. **Frontend**: Visit `https://your-app.railway.app` (should load React app)
3. **Logs**: Check Railway logs for any errors

## Local Development vs Production

| Environment | Frontend | Backend | API URL |
|------------|----------|---------|---------|
| **Development** | Vite dev server (5173) | Next.js dev (3001) | `http://localhost:3001/api` |
| **Production** | Built static files | Next.js production | `/api` (same origin) |

## Troubleshooting

### Build Fails: "package.json and package-lock.json are out of sync"
```bash
npm install
git add package-lock.json
git commit -m "fix: sync lock file"
git push
```

### MongoDB Connection Error
- Verify `DATABASE_URL` is set in Railway environment variables
- Check MongoDB allows connections from Railway's IP (0.0.0.0/0 for Railway)
- For MongoDB Atlas: Add Railway to IP whitelist

### Frontend Shows 404 for API Calls
- Verify `VITE_API_URL=/api` is set in Railway
- Check that build completed successfully (both frontend and backend)
- Verify `next.config.js` has proper rewrite rules

### Static Files Not Loading
- Ensure `vite build` runs before `next build`
- Check that `public/` folder contains built files
- Verify `public/index.html` exists

## Database Seeding

To seed your production database:

1. **Option A: Railway CLI**
```bash
railway run npm run seed
```

2. **Option B: One-time Command**
In Railway dashboard → Settings → One-off Command:
```bash
npm run seed
```

## Monitoring

Check these in Railway dashboard:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Application logs (console.log, errors)
- **Deployments**: Build history and status

## Security Notes

1. **Environment Variables**: Never commit `.env` to git
2. **MongoDB**: Use strong passwords, enable authentication
3. **CORS**: Automatically disabled in production (same-origin)
4. **Rate Limiting**: Consider adding to API routes for production

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Vite Production Build](https://vitejs.dev/guide/build.html)
