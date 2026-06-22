# Payment Integration Guide

## Overview
The Raven application uses **Paystack** for payment processing. There are two payment flows:
1. **Ad Promotion Payments** - Vixens can pay to promote their profiles
2. **Booking Payments** - Artists can pay for accepted bookings

## Issues Fixed

### 1. Invalid Paystack Keys
- **Problem**: The `.env` file contained placeholder Paystack keys
- **Fix**: Added proper environment variable validation and updated `.env.example` with clear instructions

### 2. Missing Webhook Security
- **Problem**: No signature verification on Paystack webhooks (security vulnerability)
- **Fix**: Implemented HMAC SHA-512 signature verification in `AdController.ts`

### 3. Non-functional Booking Payment
- **Problem**: "Pay Now" button in booking page had no handler
- **Fix**: Added payment initialization handler and server endpoint

### 4. Missing Client Public Key
- **Problem**: Client couldn't access Paystack public key
- **Fix**: Added `/api/ads/public-key` endpoint

### 5. Insufficient Webhook Validation
- **Problem**: No verification that payment succeeded before activating ads
- **Fix**: Added payment status verification and duplicate payment checks

### 6. TypeScript Compilation Errors
- **Problem**: Type errors in axios response handling
- **Fix**: Added proper type casting for Paystack API responses

## Configuration Required

### Step 1: Get Paystack Keys
1. Go to [Paystack Dashboard](https://dashboard.paystack.co/#/developers/keys)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your **Test Public Key** (starts with `pk_test_`)
5. Copy your **Test Secret Key** (starts with `sk_test_`)

### Step 2: Update Environment Variables
Edit your `server/.env` file and replace the placeholder keys:

```env
PAYSTACK_SECRET_KEY=sk_test_your_actual_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_actual_paystack_public_key_here
```

### Step 3: Configure Webhook URL
1. In Paystack Dashboard, go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/ads/webhook`
3. For local development, use a tool like ngrok to expose your localhost
4. Select events: `charge.success`

## Payment Flows

### Ad Promotion Flow
1. Vixen selects promotion tier on `/dashboard/vixen/promote`
2. Client calls `POST /api/ads/purchase` with tier
3. Server initializes Paystack transaction and returns authorization URL
4. User is redirected to Paystack payment page
5. After payment, Paystack sends webhook to `/api/ads/webhook`
6. Server verifies webhook signature and activates ad
7. User is redirected to `/dashboard/vixen/promote/success`

### Booking Payment Flow
1. Artist clicks "Pay Now" on booking page
2. Client calls `POST /api/bookings/payment` with bookingId
3. Server initializes Paystack transaction and returns authorization URL
4. User is redirected to Paystack payment page
5. After payment, Paystack sends webhook to `/api/ads/webhook`
6. Server verifies webhook signature and updates booking payment status
7. User is redirected back to booking page

## API Endpoints

### Ad Payment Endpoints
- `POST /api/ads/purchase` - Initiate ad promotion payment (Private, Vixen only)
- `POST /api/ads/webhook` - Paystack webhook listener (Public)
- `GET /api/ads/status` - Get ad status and history (Private)
- `GET /api/ads/public-key` - Get Paystack public key (Public)

### Booking Payment Endpoints
- `POST /api/bookings/payment` - Initiate booking payment (Private, Artist only)

## Security Features

1. **Webhook Signature Verification**: All incoming webhooks are verified using HMAC SHA-512
2. **Payment Status Validation**: Only successful payments trigger actions
3. **Duplicate Payment Prevention**: Checks for existing records before processing
4. **Authorization Checks**: Only authorized users can initiate payments
5. **Environment Variable Validation**: Server fails fast if keys are missing

## Testing

### Test Mode
Paystack provides test mode for development:
- Use test cards from [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
- No actual money is deducted
- All features work the same as production

### Test Cards
- **Success Card**: `4084 0640 3400 4042` (expires 12/25, CVV 123)
- **Failure Card**: `5060 6600 3400 4042` (expires 12/25, CVV 123)

## Production Deployment

When deploying to production:
1. Switch to live Paystack keys (starts with `sk_live_` and `pk_live_`)
2. Update webhook URL to your production domain
3. Ensure HTTPS is enabled
4. Set `NODE_ENV=production` in environment variables

## Troubleshooting

### Payment Not Initializing
- Check that Paystack keys are set in `.env`
- Verify keys are for the correct environment (test vs live)
- Check server logs for specific error messages

### Webhook Not Processing
- Verify webhook URL is correctly configured in Paystack dashboard
- Check that webhook is accessible from the internet
- Verify signature verification is working
- Check server logs for webhook errors

### Ad Not Activating After Payment
- Check webhook logs for processing errors
- Verify payment was successful in Paystack dashboard
- Check for duplicate payment prevention blocking activation
- Verify Vixen profile exists and is valid

## Server Status
✅ Server running on http://localhost:8001
✅ Database connection established
⚠️  PAYSTACK_SECRET_KEY not configured (needs to be set in .env)
