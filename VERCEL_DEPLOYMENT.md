# Vercel Deployment Guide for Career Edge Backend

## Overview
This document provides instructions for deploying the Career Edge backend to Vercel.

## Prerequisites
- Vercel account
- Git repository with your code

## Deployment Steps

1. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com) and sign in
   - Create a new project and import your repository

2. **Configure Environment Variables**
   - Add all environment variables from your `.env` file to Vercel:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret key
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - Any other required environment variables

3. **Build Settings**
   - Framework Preset: `Other`
   - Build Command: `npm install`
   - Output Directory: `./`
   - Install Command: `npm install`

4. **Deploy**
   - Click Deploy

## Troubleshooting

### 404 Not Found Errors
If you encounter 404 errors:

1. **Check Routes Configuration**
   - Ensure `vercel.json` has correct route configurations
   - All API routes should be properly mapped

2. **Check Environment Variables**
   - Verify all environment variables are set correctly in Vercel dashboard

3. **Check Logs**
   - Review deployment logs in Vercel dashboard for errors

4. **CORS Issues**
   - Ensure CORS is properly configured to allow requests from your frontend

## Frontend Configuration

Ensure your frontend's `.env` file has:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## Hybrid Application Note

This application contains both Node.js and Python components. For Vercel deployment:
- The Node.js (Express) part is fully supported
- The Python (Flask) part may need to be reimplemented as serverless functions or migrated to Node.js