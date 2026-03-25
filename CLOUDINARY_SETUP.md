# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image and video uploads in the Raven application.

## Why Cloudinary?

Cloudinary provides:
- Cloud-based image and video storage
- Automatic optimization and transformation
- CDN delivery for fast loading
- Free tier with 25GB storage and 25M transformations/month

## Step-by-Step Setup

### 1. Create a Cloudinary Account

1. Visit https://cloudinary.com/users/register/free
2. Sign up with your email or GitHub account
3. Verify your email
4. Log in to your Cloudinary dashboard

### 2. Get Your Credentials

1. Go to https://console.cloudinary.com/console
2. You'll see your **Cloud Name** at the top of the dashboard
3. Scroll down to find your **API Key** and **API Secret**
4. Keep these credentials safe - never commit them to version control

### 3. Update Your .env File

Open `server/.env` and replace the placeholder values:

```env
CLOUDINARY_CLOUD_NAME=<your_actual_cloud_name>
CLOUDINARY_API_KEY=<your_actual_api_key>
CLOUDINARY_API_SECRET=<your_actual_api_secret>
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dxyz1234
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### 4. Restart Your Server

After updating the .env file, restart your Node.js server:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

You should see:
```
✅ Cloudinary configured - using cloud storage
```

## Verification

To verify Cloudinary is working:

1. Log in to your app
2. Go to your profile
3. Try uploading an image or video
4. Check your Cloudinary dashboard at https://console.cloudinary.com/console/media_library
5. Your uploaded files should appear there

## Troubleshooting

### Still seeing "Cloudinary not configured" warning?

1. **Check your credentials** - Make sure you copied them correctly from the dashboard
2. **No spaces** - Ensure there are no extra spaces in your .env values
3. **Restart server** - Always restart after changing .env
4. **Check NODE_ENV** - Make sure `NODE_ENV=development` in your .env

### Uploads not appearing in Cloudinary?

1. Verify the upload succeeded (check browser console for errors)
2. Check your Cloudinary API quota hasn't been exceeded
3. Ensure your API credentials are correct

### "Invalid API Key" error?

1. Double-check your API Key and Secret from the dashboard
2. Make sure you're using the correct credentials (not from a different project)
3. Regenerate your API Key if needed from the dashboard settings

## Production Deployment

For production (e.g., Render):

1. Add your Cloudinary credentials to your hosting platform's environment variables
2. Set `NODE_ENV=production`
3. Ensure `FRONTEND_URL` matches your production domain

## Free Tier Limits

- 25GB storage
- 25M transformations/month
- Unlimited bandwidth
- Sufficient for most development and small production use

For more details, visit: https://cloudinary.com/pricing

## Security Best Practices

1. **Never commit credentials** - Always use .env files
2. **Use API Secret carefully** - Only use it server-side
3. **Regenerate keys** - If you suspect compromise, regenerate from dashboard
4. **Monitor usage** - Check your Cloudinary dashboard regularly for unusual activity

## Support

- Cloudinary Docs: https://cloudinary.com/documentation
- API Reference: https://cloudinary.com/documentation/cloudinary_api
- Community: https://support.cloudinary.com/
