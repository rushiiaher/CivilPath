# Vercel Deployment Guide

## Project Structure Changes

Your project has been converted to use Vercel Functions instead of a separate Express server:

- **Frontend**: React + TypeScript (Vite) - remains the same
- **Backend**: Converted to Vercel Functions in `/api` directory
- **Database**: Supabase (no changes needed)

## Deployment Steps

### 1. Push to GitHub
```bash
cd civilpath-study
git init
git add .
git commit -m "Initial commit with Vercel functions"
git branch -M main
git remote add origin https://github.com/yourusername/civilpath-study.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as the root directory
5. Vercel will auto-detect it's a Vite project

### 3. Set Environment Variables
In Vercel dashboard, go to Settings > Environment Variables and add:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key  
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key
```

### 4. Deploy
Click "Deploy" - Vercel will build and deploy automatically.

## API Endpoints

All your original endpoints are now available as Vercel Functions:

- `GET /api/health` - Health check
- `POST /api/auth/login` - Admin login
- `POST /api/auth/create-admin` - Create admin user
- `GET /api/exams` - Get all exams
- `GET /api/exams?id=123` - Get specific exam
- `POST /api/exams` - Create exam (admin)
- `PUT /api/exams?id=123` - Update exam (admin)
- `DELETE /api/exams?id=123` - Delete exam (admin)
- Similar endpoints for resources, blog, categories

## Local Development

For local development, you can still run:

```bash
# Frontend
cd frontend
npm run dev

# Backend (if you want to test the old Express server)
cd backend  
npm run dev
```

The frontend will automatically use the correct API URL based on environment.

## Benefits of Vercel Functions

- ✅ Serverless - no server management
- ✅ Auto-scaling
- ✅ Global edge network
- ✅ Zero configuration
- ✅ Integrated with frontend deployment
- ✅ Free tier includes generous limits

## File Upload Note

The original file upload functionality using multer has been removed as Vercel Functions have limitations with file uploads. For file uploads, consider:

1. **Supabase Storage** (recommended)
2. **Cloudinary**
3. **AWS S3** with presigned URLs

Would you like me to implement Supabase Storage for file uploads?