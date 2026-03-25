import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_CLOUD_NAME !== '<your_cloud_name>' &&
    !process.env.CLOUDINARY_CLOUD_NAME?.includes('your_') &&
    !process.env.CLOUDINARY_API_KEY?.includes('your_');

let storage: any;

if (isCloudinaryConfigured) {
    console.log('✅ Cloudinary configured - using cloud storage');
    // Use Cloudinary storage
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req: Request, file: Express.Multer.File) => {
            let folder = 'raven/others';
            let resource_type = 'auto';

            if (file.mimetype.startsWith('image/')) {
                folder = 'raven/images';
                resource_type = 'image';
            } else if (file.mimetype.startsWith('video/')) {
                folder = 'raven/videos';
                resource_type = 'video';
            }

            return {
                folder: folder,
                resource_type: resource_type,
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov', 'avi'],
                public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
            };
        },
    });
} else {
    // Fallback to local storage for development
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    console.warn('⚠️  Cloudinary not configured. Using local file storage for development.');
    console.warn('⚠️  To use Cloudinary, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');

    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
    });
}

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/quicktime',
        'video/x-msvideo'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: JPEG, PNG, GIF, MP4, MOV, AVI`));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit
    },
    fileFilter: fileFilter,
});

// Error handling middleware for multer
export const handleUploadError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File is too large. Maximum size is 100MB.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files uploaded.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ message: err.message || 'File upload failed' });
    }
    next();
};

export default upload;
