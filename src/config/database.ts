import mongoose from 'mongoose';
import { env } from './env';

function maskMongoUri(uri: string): string {
  return uri.replace(/:([^:@/]+)@/, ':****@');
}

/** Whether MongoDB is currently connected */
export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Connect to MongoDB when configured. Returns false when disabled or connection fails
 * (unless MONGODB_REQUIRED=true, which exits the process on failure).
 */
export const connectDB = async (): Promise<boolean> => {
  if (!env.mongodb.enabled) {
    console.log('[MongoDB] Disabled — API runs in email-only mode (no database)');
    return false;
  }

  if (!env.mongodb.uri) {
    console.warn('[MongoDB] Enabled but no connection string found — skipping database');
    return false;
  }

  try {
    const conn = await mongoose.connect(env.mongodb.uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return true;
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error('MongoDB connection error:', error);
    console.error(`Connection target: ${maskMongoUri(env.mongodb.uri)}`);

    if (err.code === 8000 || err.message?.includes('authentication failed')) {
      console.error(
        '\nAtlas auth failed. Check in MongoDB Atlas → Database Access:\n' +
          '  • Username and password match MONGODB_USER / MONGODB_PASSWORD in .env\n' +
          '  • Use the raw password (e.g. webfastDb@2330) — do not manually encode @ as %40\n' +
          '  • Or paste the full connection string from Atlas as MONGODB_URI\n'
      );
    }

    if (env.mongodb.required) {
      process.exit(1);
    }

    console.warn(
      '[MongoDB] Connection failed — server will continue without database (contact form uses email only)'
    );
    return false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
