import mongoose from 'mongoose';

const isProduction = process.env.NODE_ENV === 'production';
// Fix for TypeScript compilation - ensuring proper connection typing

const connectDB = async () => {
    const atlasUri = process.env.MONGO_URI;
    const localUri = 'mongodb://localhost:27017/raven_db';
    
    try {
        const uriToUse = atlasUri || localUri;
        const maskedUri = uriToUse.replace(/:([^@]+)@/, ':****@');

        console.log(`[DB-V2] 📡 Attempting MongoDB connection to: ${maskedUri}`);

        await mongoose.connect(uriToUse, {
            serverSelectionTimeoutMS: 15000, // Increased timeout
            connectTimeoutMS: 15000,         // Increased timeout
            socketTimeoutMS: 45000,          // Socket timeout
            family: 4, // Force IPv4
            tls: true,
            // Remove tlsAllowInvalidCertificates in production - only for local debugging
            tlsAllowInvalidCertificates: !isProduction && process.env.NODE_ENV === 'development',
            // Connection pooling settings
            maxPoolSize: 10,                 // Maintain up to 10 socket connections
            minPoolSize: 2,                  // Maintain minimum of 2 connections
            maxIdleTimeMS: 30000,            // Max idle time before removing from pool
            waitQueueTimeoutMS: 15000,       // Max wait time for connection from pool
            retryWrites: true,
            w: 'majority',
        });
        
        if (!isProduction) {
            console.log(`✓ MongoDB Connected: ${mongoose.connection.host}`);
        }
    } catch (error) {
        const errMessage = (error as Error).message;
        console.error(`\n✗ MongoDB Connection Error: ${errMessage}`);
        
        // Enhanced error logging with timestamp and error details
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] Connection failed:`, {
            error: errMessage,
            code: (error as any).code,
            hostname: (error as any).hostname,
            // Don't log sensitive info in error messages
        });

        // Check for specific SSL/TLS errors common with Atlas whitelist issues
        if (errMessage.includes('alert number 80') || errMessage.includes('SSL routines')) {
            console.error('\n🛡️  SECURITY WARNING: SSL Internal Error (Alert 80) detected.');
            console.error('This is almost certainly an IP Whitelisting issue in MongoDB Atlas.');
            console.error('1. Log in to Atlas: https://cloud.mongodb.com');
            console.error('2. Go to "Network Access" under "Security"');
            console.error('3. Add your current public IP via "Add IP Address" -> "Add Current IP Address"');
            console.error('4. For testing, you can use 0.0.0.0/0 (Allows all IPs - use with caution)\n');
        }

        if (atlasUri && !isProduction) {
            console.log('⚠️  Falling back to local MongoDB for development...');

            try {
                await mongoose.connect(localUri, {
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 5000,
                });
                console.log('✓ Connected to LOCAL MongoDB at localhost:27017');
                return;
            } catch (localErr) {
                console.error('✗ Local MongoDB fallback failed. Make sure a local MongoDB instance is running.');
            }
        }
        
        console.error('Server will continue running but database operations will fail until connected.\n');
        
        // Enhanced retry logic with exponential backoff
        const baseDelay = isProduction ? 5000 : 2000; // Base delay in ms
        const maxDelay = isProduction ? 60000 : 30000; // Max delay in ms
        const attempt = parseInt((global as any)._mongoConnectAttempt || '0', 10) + 1;
        (global as any)._mongoConnectAttempt = attempt;
        
        // Calculate delay with exponential backoff and jitter
        const expDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
        const jitter = Math.random() * 1000; // 0-1000ms random jitter
        const delay = expDelay + jitter;
        
        console.log(`[Retry Attempt ${attempt}] Retrying MongoDB connection in ${Math.round(delay)}ms...`);

        setTimeout(() => {
            console.log('Retrying MongoDB connection...');
            connectDB();
        }, delay);
    }
};

// Handle connection events with enhanced logging
mongoose.connection.on('connected', () => {
    // Reset connection attempt counter on successful connection
    if ((global as any)._mongoConnectAttempt !== undefined) {
        delete (global as any)._mongoConnectAttempt;
    }
    
    if (!isProduction) {
        console.log('✓ Mongoose connected to MongoDB');
        console.log(`  Host: ${mongoose.connection.host}`);
        console.log(`  Port: ${mongoose.connection.port}`);
        console.log(`  Database: ${mongoose.connection.name}`);
    }
});

mongoose.connection.on('error', (err) => {
    const errMessage = err.message || '';
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ✗ Mongoose connection error:`, errMessage);
    
    if (errMessage.includes('alert number 80') || errMessage.includes('SSL routines')) {
        console.error('\n🛡️  SECURITY WARNING: SSL Internal Error (Alert 80) detected.');
        console.error('This is usually an IP Whitelisting issue on MongoDB Atlas.');
        console.log('Follow the instructions above to fix it.\n');
    }
});

mongoose.connection.on('disconnected', () => {
    if (!isProduction) {
        console.log('⚠️  Mongoose disconnected from MongoDB');
        console.log('  Attempting to reconnect...');
    }
});

// Handle reconnection attempts
mongoose.connection.on('reconnected', () => {
    if (!isProduction) {
        console.log('✓ Mongoose reconnected to MongoDB');
    }
});

mongoose.connection.on('close', () => {
    if (!isProduction) {
        console.log('⚠️  MongoDB connection closed');
    }
});

export default connectDB;
