# Fix: E11000 Duplicate Key Error

## Problem
```
❌ Error updating admin user: E11000 duplicate key error collection: raven_db.users 
index: email_1 dup key: { email: "chideraobia7@gmail.com" }
```

## Cause
The email `chideraobia7@gmail.com` already exists in the database with a different user account.

## Solution

Use the new `npm run reset-admin` command that:
1. Deletes the old admin user
2. Creates a new admin with your credentials
3. Keeps all other data intact

## How to Fix

### Step 1: Run the reset script
```bash
cd server
npm run reset-admin
```

You should see:
```
✅ Connected to DB
🗑️  Deleted old admin: old-email@example.com
✅ New admin user created successfully

📋 Admin Details:
   Name: Admin User
   Email: chideraobia7@gmail.com
   Password: Mylove@go2
   Role: admin
   Verified: true

✅ Ready to login!
   URL: http://localhost:3000/login
   Email: chideraobia7@gmail.com
   Password: Mylove@go2
```

### Step 2: Login with new credentials
1. Go to `http://localhost:3000/login`
2. Email: `chideraobia7@gmail.com`
3. Password: `Mylove@go2`
4. Click "Sign in"

## Commands Comparison

| Command | Action | Data Loss |
|---------|--------|-----------|
| `npm run seed` | Clear all data + create test users | ✅ YES (all) |
| `npm run update-admin` | Update existing admin | ❌ NO |
| `npm run reset-admin` | Delete old admin + create new | ❌ NO (only admin) |

## When to Use Each

**Use `npm run reset-admin`:**
- Email already exists error
- Want to replace admin with new credentials
- Keep all other users/data

**Use `npm run update-admin`:**
- Admin exists and you want to update it
- No duplicate email issues

**Use `npm run seed`:**
- First time setup
- Want fresh test data
- Testing with clean database

## What Gets Deleted
- ❌ Old admin user only

## What Stays Unchanged
- ✅ All other users (artists, vixens)
- ✅ All bookings
- ✅ All messages
- ✅ All reviews
- ✅ All ads
- ✅ All profiles

## Troubleshooting

### Still getting duplicate key error?
1. Check if email exists in another user account
2. Run `npm run reset-admin` again
3. Verify MongoDB connection

### "Cannot find module"
```bash
npm install
npm run reset-admin
```

### "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify connection string

## Quick Reference

```bash
# Fix duplicate email error
npm run reset-admin

# Update existing admin
npm run update-admin

# Full seed (clears all data)
npm run seed

# Start server
npm run dev
```

## Security

✅ Your credentials stay private
✅ reset-admin.ts is NOT committed to GitHub
✅ Only exists locally on your machine
✅ Use strong passwords
✅ Keep email secure

## Next Steps

1. Run `npm run reset-admin`
2. Login with your credentials
3. Verify admin dashboard works
4. Test logout button
5. All your data is preserved!
