import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from 'express';

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
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
            allowed_formats: ['jpg', 'png', 'jpeg', 'mp4', 'mov', 'avi'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    },
});

export default upload;
