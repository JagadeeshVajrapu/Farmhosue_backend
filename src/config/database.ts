import mongoose from 'mongoose';
import { env } from './env';

function maskMongoUri(uri: string): string {
  return uri.replace(/:([^:@/]+)@/, ':****@');
}

/**
 * Connect to MongoDB Atlas
 */
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    console.error('MongoDB connection error:', error);
    console.error(`Connection target: ${maskMongoUri(env.mongodbUri)}`);

    if (err.code === 8000 || err.message?.includes('authentication failed')) {
      console.error(
        '\nAtlas auth failed. Check in MongoDB Atlas → Database Access:\n' +
          '  • Username and password match MONGODB_USER / MONGODB_PASSWORD in .env\n' +
          '  • Use the raw password (e.g. webfastDb@2330) — do not manually encode @ as %40\n' +
          '  • Or paste the full connection string from Atlas as MONGODB_URI\n'
      );
    }

    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
