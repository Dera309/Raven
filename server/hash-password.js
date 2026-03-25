#!/usr/bin/env node

/**
 * Password Hasher Utility
 * 
 * Usage: node hash-password.js [password]
 * Example: node hash-password.js admin123
 * 
 * This script generates a bcrypt hashed password that can be used
 * when creating admin users in the database.
 */

const bcrypt = require('bcryptjs');

async function hashPassword() {
    const password = process.argv[2] || 'admin123';
    
    if (!password) {
        console.error('❌ Please provide a password');
        console.log('Usage: node hash-password.js [password]');
        process.exit(1);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        console.log('\n✅ Password hashed successfully!\n');
        console.log('Original password:', password);
        console.log('Hashed password:', hashedPassword);
        console.log('\n📋 Use this hashed password in your MongoDB document:\n');
        console.log('{');
        console.log('  "name": "Admin User",');
        console.log('  "email": "admin@raven.com",');
        console.log(`  "password": "${hashedPassword}",`);
        console.log('  "role": "admin",');
        console.log('  "isVerified": true,');
        console.log('  "loginAttempts": 0');
        console.log('}\n');
    } catch (error) {
        console.error('❌ Error hashing password:', error.message);
        process.exit(1);
    }
}

hashPassword();
