"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const swagger_1 = require("./app/config/swagger");
require("./app/config/firebase");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
// CORS configuration for specific domains
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://heaven-holiday2026.vercel.app',
            'https://heaven-holiday2026-pnpk.vercel.app',
        ];
        if (!origin)
            return callback(null, true);
        // Allow localhost & 127.0.0.1 in development
        if (process.env.NODE_ENV !== 'production') {
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma',
        'X-CSRF-Token',
        'X-User-Role',
    ],
    exposedHeaders: ['Content-Disposition', 'X-Total-Count'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
// Body parsers
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
// Swagger (dev only)
if (process.env.NODE_ENV !== 'production') {
    (0, swagger_1.setupSwagger)(app);
}
// Routes
app.use('/v1/api', routes_1.default);
const entryRoute = (req, res) => {
    res.send('Matrimony server is running');
};
app.get('/', entryRoute);
// Not Found
app.use(notFound_1.default);
// Global Error Handler
app.use(globalErrorHandler_1.default);
exports.default = app;
