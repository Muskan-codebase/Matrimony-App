import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { Request } from 'express'; // Import the Request type

dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req: Request, _file: Express.Multer.File) => {
      if (req.originalUrl.includes('/products')) {
        return 'restaurant-products';
      } else if (
        req.originalUrl.includes('/categories') ||
        req.originalUrl.includes('/productsCategory')
      ) {
        return 'restaurant-categories';
      } else if (req.originalUrl.includes('/banners')) {
        return 'restaurant-banners';
      } else if (req.originalUrl.includes('/blogs')) {
        return 'restaurant-blogs';
      } else if (req.originalUrl.includes('/teams')) {
        return 'restaurant-teams';
      } else if (req.originalUrl.includes('/aboutus')) {
        return 'restaurent-teams';
      } else if (req.originalUrl.includes('/hero-banner')) {
        return 'restaurent-banners';
      } else if (req.originalUrl.includes('/gallery')) {
        return 'restaurent-gallery';
      } else if (req.originalUrl.includes('/services')) {
        return 'restaurent-services';
      } else if (req.originalUrl.includes('/csr-preamble')) {
        return 'restaurent-csr-preamble';
      } else if (req.originalUrl.includes('/csr-management')) {
        return 'restaurent-csr-management';
      } else if (req.originalUrl.includes('/csr-purpose-policy')) {
        return 'restaurent-csr-policy';
      } else if (req.originalUrl.includes('/contact-city')) {
        return 'restaurent-csr-city';
      } else if (req.originalUrl.includes('/tour-manager-team')) {
        return 'restaurent-tour-manager-team';
      } else if (req.originalUrl.includes('/tour-package')) {
        return 'restaurent-tour-package';
      } else if (req.originalUrl.includes('/offer-banner')) {
        return 'restaurent-offer-banner';
      } else if (req.originalUrl.includes('/trending-destinations')) {
        return 'restaurent-trending-destinations';
      } else if (req.originalUrl.includes('/podcasts')) {
        return 'restaurent-podcasts';
      } else if (req.originalUrl.includes('/tours-gallery')) {
        return 'restaurent-tours-gallery';
      } else if (req.originalUrl.includes('/annual-return')) {
        return 'restaurent-annual-return-pdf';
      } else if (req.originalUrl.includes('/online-booking')) {
        return 'restaurent-online-booking';
      } else if (req.originalUrl.includes('/job-applications')) {
        return 'restaurent-job-applications';
      } else if (req.originalUrl.includes('/books')) {
        return 'restaurent-books';
      } else if (req.originalUrl.includes("/profile")) {
        return "matrimony/profiles";
      } else if (req.originalUrl.includes("/on-boarding")) {
        return "matrimony/onboarding";
      } else if (req.originalUrl.includes("/success-stories")) {
        return "matrimony/success-stories";
      } else if (req.originalUrl.includes("/chat")) {
        return "matrimony/chat";
      }
      return 'restaurant-uploads';
    },
    allowed_formats: [
      // Images
      'jpg',
      'jpeg',
      'png',
      'webp',
      'avif',
      'gif',
      'svg',
      'bmp',
      'tiff',
      'ico',
      // Videos
      'mp4',
      'mov',
      'avi',
      'mkv',
      'mpeg',
      'mpg',
      'wmv',
      'flv',
      'webm',
      '3gp',
      // Audio
      'mp3',
      'wav',
      'm4a',
      'aac',
      'ogg',
      'oga',
      'flac',
      'wma',
      'opus',
      'amr',
      // Documents
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
    ],
    resource_type: (req: Request, file: Express.Multer.File) => {
      if (file.mimetype === 'application/pdf') return 'raw';
      return 'auto';
    },
    type: 'upload',
    transformation: (req: Request, file: Express.Multer.File) => {
      return [];
    },
  } as any,
});

// File filter to validate MIME types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/x-icon',
    // Videos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/mpeg',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/webm',
    'video/3gpp',
    // Audio
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac',
    'audio/ogg',
    'audio/vorbis',
    'audio/flac',
    'audio/x-ms-wma',
    'audio/opus',
    'audio/amr',
    'audio/webm',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('An unknown file format not allowed'));
  }
};

// Initialize multer upload
const upload = multer({ storage, fileFilter });

export { cloudinary, upload };
