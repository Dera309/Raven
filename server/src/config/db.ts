import mongoose from 'mongoose';

const isProduction = process.env.NODE_ENV === 'production';

const connectDB = async () => {
    const atlasUri = process.env.MONGO_URI;
    const localUri = 'mongodb://localhost:27017/raven_db';
    
    try {
        mongoose.set('bufferCommands', false);
        const uriToUse = atlasUri || localUri;
        const maskedUri = uriToUse.replace(/:([^@]+)@/, ':****@');
        console.log(`📡 Attempting MongoDB connection to: ${maskedUri}`);

        const conn = await mongoose.connect(uriToUse, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            family: 4, // Force IPv4 to avoid SSL Alert 80 internal error issues
        });
        
        if (!isProduction) {
            console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        const errMessage = (error as Error).message;
        console.error(`\n✗ MongoDB Connection Error: ${errMessage}`);
        
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
                    serverSelectionTimeoutMS: 2000,
                });
                console.log('✓ Connected to LOCAL MongoDB at localhost:27017');
                return;
            } catch (localErr) {
                console.error('✗ Local MongoDB fallback failed. Make sure a local MongoDB instance is running.');
            }
        }
        
        console.error('Server will continue running but database operations will fail until connected.\n');
        
        // Retry logic...
        const retryInterval = isProduction ? 30000 : 15000;
        setTimeout(() => {
            console.log('Retrying MongoDB connection...');
            connectDB();
        }, retryInterval);
    }
};

// Handle connection events - minimal logging in production
mongoose.connection.on('connected', () => {
    if (!isProduction) {
        console.log('✓ Mongoose connected to MongoDB');
    }
});

mongoose.connection.on('error', (err) => {
    console.error('✗ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    if (!isProduction) {
        console.log('⚠️  Mongoose disconnected from MongoDB');
    }
});

export default connectDB;
