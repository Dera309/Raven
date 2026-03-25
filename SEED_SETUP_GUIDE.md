# Setting Up Your Seed Script

## Important: Protect Your Credentials

The `seed.ts` file is **NOT** tracked by Git to protect your admin credentials. You need to create it locally.

## Step 1: Create Your seed.ts File

1. Copy the example file:
   ```bash
   cp server/src/seed.ts.example server/src/seed.ts
   ```

2. Or manually create `server/src/seed.ts` with your credentials

## Step 2: Edit seed.ts with Your Credentials

Open `server/src/seed.ts` and find the Admin User section:

```typescript
// Create Admin User
const adminSalt = await bcrypt.genSalt(10);
const adminPassword = await bcrypt.hash('your-secure-password-here', adminSalt);

await User.create({
    name: 'Admin User',
    email: 'your-email@example.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    isVerified: true
});
```

Replace:
- `'your-secure-password-here'` → Your desired admin password
- `'your-email@example.com'` → Your real email address

### Example:
```typescript
const adminPassword = await bcrypt.hash('MySecurePassword123!', adminSalt);

await User.create({
    name: 'Admin User',
    email: 'admin@mycompany.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    isVerified: true
});
```

## Step 3: Run the Seed Script

```bash
cd server
npm run seed
```

You should see:
```
Connected to DB
Cleared existing data
Created Artist User
Created Vixen User
Created Admin User
Seeding completed successfully
```

## Step 4: Login with Your Credentials

1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. You'll be redirected to the admin dashboard

## Security Best Practices

✅ **DO:**
- Use strong passwords (8+ characters, mix of letters, numbers, symbols)
- Use your real email address
- Keep seed.ts file private (it's in .gitignore)
- Never commit seed.ts to GitHub

❌ **DON'T:**
- Use simple passwords like "admin123"
- Share your seed.ts file
- Commit credentials to version control
- Use the same password for multiple accounts

## Changing Admin Credentials Later

If you need to change admin credentials:

1. Edit `server/src/seed.ts` with new credentials
2. Run `npm run seed` again
3. The script will clear and recreate all test data

## What Gets Created

The seed script creates 3 test users:

| User | Email | Password | Role |
|------|-------|----------|------|
| Test Artist | artist@test.com | password123 | artist |
| Test Vixen | vixen@test.com | password123 | vixen |
| Admin User | your-email@example.com | your-password | admin |

## Troubleshooting

### "seed.ts not found"
- Copy from seed.ts.example: `cp server/src/seed.ts.example server/src/seed.ts`
- Edit with your credentials
- Run again

### "Cannot find module"
- Run `npm install` first
- Then `npm run seed`

### "MongoDB connection failed"
- Check .env file has correct MONGO_URI
- Ensure MongoDB is running
- Verify connection string

## File Structure

```
server/
├── src/
│   ├── seed.ts              ← Your local seed file (NOT in Git)
│   ├── seed.ts.example      ← Template file (in Git)
│   └── ...
└── ...
```

## Next Steps

After seeding:
1. ✅ Login as admin
2. ✅ View admin dashboard
3. ✅ Test user management
4. ✅ Create real users through registration

## Remember

- `seed.ts` is in `.gitignore` - it won't be committed
- `seed.ts.example` is in Git - it's a template
- Always use strong, unique credentials
- Keep your seed.ts file secure
