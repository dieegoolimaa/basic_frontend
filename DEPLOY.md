# Vercel Deployment Instructions

## Deploy on Vercel

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `dieegoolimaa/basic_frontend`
4. Configure project:

**Framework Preset:** Angular

**Build Settings:**

- Build Command: `npm run build`
- Output Directory: `dist/basic-frontend/browser` (Angular 18+)
- Install Command: `npm install`

**Root Directory:** (leave empty)

### 3. Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
PRODUCTION=true
```

Then update your `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-backend-url.onrender.com/api",
};
```

### 4. Deploy

- Click "Deploy"
- Wait for build to complete
- Your app will be available at: `https://your-project-name.vercel.app`

### 5. Update Backend CORS

After deployment, update your backend `main.ts` to include your Vercel URL:

```typescript
app.enableCors({
  origin: ["http://localhost:4200", "https://your-project-name.vercel.app"],
  credentials: true,
});
```

Redeploy backend for changes to take effect.

### Deploy via CLI (Alternative)

```bash
cd basic_frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update CORS in backend

### Important Notes:

- Vercel free tier includes:
  - Unlimited deployments
  - Automatic HTTPS
  - Global CDN
  - Preview deployments for PRs
- Build output directory for Angular 18+: `dist/basic-frontend/browser`
- Angular requires SPA fallback (handled by vercel.json)

### Troubleshooting

**404 on refresh?**

- Check vercel.json is present and configured correctly

**Build fails?**

- Verify `dist/basic-frontend/browser` path
- Check build logs for TypeScript errors

**CORS errors?**

- Ensure backend CORS includes Vercel URL
- Check browser console for exact error
