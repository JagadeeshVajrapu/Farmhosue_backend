import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { isDbConnected } from './config/database';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import uploadRoutes from './routes/uploadRoutes';
import contactRoutes from './routes/contactRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  const database = !env.mongodb.enabled
    ? 'disabled'
    : isDbConnected()
      ? 'connected'
      : 'disconnected';

  res.json({
    success: true,
    message: 'Vidhaan Farmhouse API is running',
    database,
    smtp: env.smtp.isConfigured ? 'configured' : 'missing',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
