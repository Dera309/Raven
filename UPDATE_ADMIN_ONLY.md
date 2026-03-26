# Update Admin User Only (Without Clearing Data)

## Problem
`npm run seed` clears ALL data (users, bookings, etc.). You just want to update the admin credentials.

## Solution
Use the new `npm run update-admin` command that ONLY updates the admin user!

## Step 1: Edit update-admin.ts

Open `server/src/update-admin.ts` and find this section:

```typescript
// Hash new password
const adminSalt = await bcrypt.genSalt(10);
const adminPassword = await bcrypt.hash('your-secure-password-here', adminSalt);

if (existingAdmin) {
    // Update existing admin
    existingAdmin.email = 'your-email@example.com';
```

Replace with your real credentials:

```typescript
// Hash new password
const adminSalt = await bcrypt.genSalt(10);
const adminPassword = await bcrypt.hash('MySecurePassword@2024!', adminSalt);

if (existingAdmin) {
    // Update existing admin
    existingAdmin.email = 'chideraobia7@gmail.com';
```

## Step 2: Run the Update Script

```bash
cd server
npm run update-admin
```

You should see:
```
✅ Connected to DB
Found existing admin: old-email@example.com
Updating admin user...
✅ Admin user updated successfully

📋 Admin Details:
   Email: chideraobia7@gmail.com
   Password: MySecurePassword@2024!
   Role: admin
   Verified: true
```

## Step 3: Login with New Credentials

1. Go to `http://localhost:3000/login`
2. Enter your new email and password
3. Click "Sign in"
4. You're logged in to admin dashboard!

## What Gets Updated

✅ Admin email
✅ Admin password
✅ Admin name
✅ Admin verification status

## What Stays Unchanged

✅ All other users (artists, vixens)
✅ All bookings
✅ All messages
✅ All reviews
✅ All ads
✅ All profiles

## Comparison

| Command | Clears Data | Updates Admin |
|---------|-------------|---------------|
| `npm run seed` | ✅ YES (all) | ✅ YES |
| `npm run update-admin` | ❌ NO | ✅ YES |

## When to Use Each

**Use `npm run seed`:**
- First time setup
- Want fresh test data
- Testing with clean database

**Use `npm run update-admin`:**
- Already have data you want to keep
- Just need to change admin credentials
- Don't want to lose existing users/bookings

## Important Notes

⚠️ **Remember:**
- Edit `src/update-admin.ts` with YOUR credentials
- The file is NOT in .gitignore (it's a template)
- Don't commit your real credentials
- Use strong passwords (12+ characters)
- Use your real email address

## Troubleshooting

### "Cannot find module"
```bash
npm install
npm run update-admin
```

### "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify connection string

### "No admin user found"
- Script will create a new admin
- Or run `npm run seed` first to create test data

## Quick Reference

```bash
# Update admin only (keeps all data)
npm run update-admin

# Full seed (clears all data)
npm run seed

# Start server
npm run dev

# Start client
npm run dev (in client folder)
```

## Security

✅ Your credentials stay private
✅ update-admin.ts is a template
✅ Don't commit with real credentials
✅ Use strong passwords
✅ Keep email secure

## Next Steps

1. Edit `src/update-admin.ts` with your credentials
2. Run `npm run update-admin`
3. Login with new credentials
4. Verify admin dashboard works
5. Test logout button
