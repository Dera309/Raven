import mongoose from 'mongoose';

const isProduction = process.env.NODE_ENV === 'production';

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/raven_db', {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            family: 4, // Force IPv4 to avoid SSL Alert 80 internal error issues
        });
        
        if (!isProduction) {
            console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
        }
    } catch (error) {
        console.error(`✗ MongoDB Connection Error: ${(error as Error).message}`);
        
        // Only show detailed connection help in development
        if (!isProduction) {
            console.error('\n⚠️  IMPORTANT: MongoDB Connection Failed!');
            console.error('1. Whitelist your IP in MongoDB Atlas: https://cloud.mongodb.com -> Network Access');
            console.error('2. Ensure your MONGO_URI is correct in the .env file.');
            console.error('3. Try using 0.0.0.0/0 temporarily to test if it is a whitelist issue.\n');
        }
        
        console.error('Server will continue running but database operations will fail until connected.\n');
        
        // Retry connection every 30 seconds in production, 10 seconds in development
        const retryInterval = isProduction ? 30000 : 10000;
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
