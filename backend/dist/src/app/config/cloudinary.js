"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Create storage engine
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: (req, _file) => {
            if (req.originalUrl.includes('/products')) {
                return 'restaurant-products';
            }
            else if (req.originalUrl.includes('/categories') ||
                req.originalUrl.includes('/productsCategory')) {
                return 'restaurant-categories';
            }
            else if (req.originalUrl.includes('/banners')) {
                return 'restaurant-banners';
            }
            else if (req.originalUrl.includes('/blogs')) {
                return 'restaurant-blogs';
            }
            else if (req.originalUrl.includes('/teams')) {
                return 'restaurant-teams';
            }
            else if (req.originalUrl.includes('/aboutus')) {
                return 'restaurent-teams';
            }
            else if (req.originalUrl.includes('/hero-banner')) {
                return 'restaurent-banners';
            }
            else if (req.originalUrl.includes('/gallery')) {
                return 'restaurent-gallery';
            }
            else if (req.originalUrl.includes('/services')) {
                return 'restaurent-services';
            }
            else if (req.originalUrl.includes('/csr-preamble')) {
                return 'restaurent-csr-preamble';
            }
            else if (req.originalUrl.includes('/csr-management')) {
                return 'restaurent-csr-management';
            }
            else if (req.originalUrl.includes('/csr-purpose-policy')) {
                return 'restaurent-csr-policy';
            }
            else if (req.originalUrl.includes('/contact-city')) {
                return 'restaurent-csr-city';
            }
            else if (req.originalUrl.includes('/tour-manager-team')) {
                return 'restaurent-tour-manager-team';
            }
            else if (req.originalUrl.includes('/tour-package')) {
                return 'restaurent-tour-package';
            }
            else if (req.originalUrl.includes('/offer-banner')) {
                return 'restaurent-offer-banner';
            }
            else if (req.originalUrl.includes('/trending-destinations')) {
                return 'restaurent-trending-destinations';
            }
            else if (req.originalUrl.includes('/podcasts')) {
                return 'restaurent-podcasts';
            }
            else if (req.originalUrl.includes('/tours-gallery')) {
                return 'restaurent-tours-gallery';
            }
            else if (req.originalUrl.includes('/annual-return')) {
                return 'restaurent-annual-return-pdf';
            }
            else if (req.originalUrl.includes('/online-booking')) {
                return 'restaurent-online-booking';
            }
            else if (req.originalUrl.includes('/job-applications')) {
                return 'restaurent-job-applications';
            }
            else if (req.originalUrl.includes('/books')) {
                return 'restaurent-books';
            }
            else if (req.originalUrl.includes("/profile")) {
                return "matrimony/profiles";
            }
            else if (req.originalUrl.includes("/on-boarding")) {
                return "matrimony/onboarding";
            }
            else if (req.originalUrl.includes("/success-stories")) {
                return "matrimony/success-stories";
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
        resource_type: (req, file) => {
            if (file.mimetype === 'application/pdf')
                return 'raw';
            return 'auto';
        },
        type: 'upload',
        transformation: (req, file) => {
            return [];
        },
    },
});
// File filter to validate MIME types
const fileFilter = (req, file, cb) => {
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
    }
    else {
        cb(new Error('An unknown file format not allowed'));
    }
};
// Initialize multer upload
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.upload = upload;
