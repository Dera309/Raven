---
description: How to deploy the Raven application to Render using Blueprints
---

Follow these steps to host the Raven application on Render. This method uses the `render.yaml` file already present in your repository to automatically configure both the backend (raven-api) and frontend (raven-client).

### Prerequisites
1. Ensure all changes are pushed to your GitHub repository (`Dera309/Raven`).
2. Have your MongoDB Atlas connection string and Cloudinary credentials ready.

### Deployment Steps

1. **Connect to Render**
   - Log in to your [Render Dashboard](https://dashboard.render.com/).
   - Click **New +** at the top right and select **Blueprint**.

2. **Select Repository**
   - Connect your GitHub account if you haven't already.
   - Select the `Dera309/Raven` repository.

3. **Configure the Blueprint**
   - Render will detect the `render.yaml` file. Give your group of services a name (e.g., `raven-app`).
   - You will see a list of environment variables that need values (marked as `sync: false` in the config).
   - **Copy these values from your local `server/.env` file:**
     - `MONGO_URI`
     - `JWT_SECRET`
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
     - `PAYSTACK_SECRET_KEY` (use the `sk_test_...` ones we just set)
     - `PAYSTACK_PUBLIC_KEY` (use the `pk_test_...` ones we just set)

4. **Apply and Wait**
   - Click **Apply**. Render will start building the backend first, then the frontend.
   - You can monitor the "Deploy" logs for both services in the Render dashboard.

5. **Final Step: Update URLs**
   - Once both services are deployed, they will be given unique URLs (e.g., `raven-api.onrender.com`).
   - They might fail to talk to each other initially because of the placeholder URLs in `render.yaml`.
   - **In the Render Dashboard:**
     - Go to the **raven-api** service -> Environment. Update `FRONTEND_URL` to your actual `raven-client` URL.
     - Go to the **raven-client** service -> Environment. Update `NEXT_PUBLIC_API_URL` to your actual `raven-api` URL + `/api` (e.g., `https://raven-api.onrender.com/api`).
     - Update `NEXT_PUBLIC_SOCKET_URL` to the `raven-api` URL.

6. **Redeploy**
   - Render will usually automatically redeploy when you change environment variables. If not, click **Manual Deploy** > **Clear Cache & Deploy**.
