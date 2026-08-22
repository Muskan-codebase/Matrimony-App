import express, { Application, Request, Response } from 'express';
import cors, { CorsOptions } from 'cors';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { setupSwagger } from './app/config/swagger';
import "./app/config/firebase";
import path from "path";
import compression from "compression";

const app: Application = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// CORS configuration for specific domains
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://heaven-holiday2026.vercel.app',
      'https://heaven-holiday2026-pnpk.vercel.app',
      ''
    ];

    if (!origin) return callback(null, true);

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

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(compression());

// Swagger (dev only)
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// Routes
app.use('/v1/api', router);

const entryRoute = (req: Request, res: Response) => {
  res.send('Matrimony server is running');
};

app.get('/', entryRoute);

// Not Found
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
