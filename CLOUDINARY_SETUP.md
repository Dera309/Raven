# Cloudinary Setup Guide

## Overview
Raven uses Cloudinary for image and video uploads. If Cloudinary is not configured, the app will fall back to local file storage for development.

## Setup Instructions

### 1. Create a Cloudinary Account
- Go to https://cloudinary.com
- Sign up for a free account
- Verify your email

### 2. Get Your Credentials
- Log in to your Cloudinary dashboard
- Go to **Settings** (gear icon)
- Click on the **API Keys** tab
- You'll see:
  - **Cloud Name** (required)
  - **API Key** (required)
  - **API Secret** (required)

### 3. Configure Environment Variables

#### For Development (Local)
Edit `server/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### For Production (Render)
1. Go to your Render backend service
2. Click on **Environment**
3. Add the following variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Click **Save Changes**
5. Redeploy the service

### 4. Test the Configuration
- Try uploading a photo in the app
- If successful, the image will be stored on Cloudinary
- If Cloudinary is not configured, files will be stored locally in `server/uploads/`

## Fallback Behavior

If Cloudinary credentials are not configured:
- ✅ App will still work
- ✅ Files will be stored locally in `server/uploads/`
- ⚠️ Files won't persist after server restart
- ⚠️ Not suitable for production

## Troubleshooting

### "Failed to upload media" Error
1. Check that all three Cloudinary credentials are set
2. Verify credentials are correct (copy-paste from dashboard)
3. Check that `CLOUDINARY_CLOUD_NAME` is not set to `your_cloud_name`
4. Restart the server after updating credentials

### Files Not Appearing
- Check Cloudinary dashboard > Media Library
- Verify the upload folder structure (raven/images, raven/videos)
- Check server logs for upload errors

### Local Storage Issues
- Check that `server/uploads/` directory exists
- Verify file permissions on the uploads directory
- Clear old uploads if disk space is low

## Security Notes
- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Rotate API keys periodically
- Use restricted API keys in production if possible
