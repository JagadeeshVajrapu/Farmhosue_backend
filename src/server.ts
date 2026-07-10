import app from './app';
import { connectDB } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  const dbConnected = await connectDB();

  app.listen(env.port, () => {
    console.log(`Vidhaan Farmhouse API running on port ${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Database: ${dbConnected ? 'connected' : env.mongodb.enabled ? 'unavailable' : 'disabled'}`);
    console.log(`SMTP: ${env.smtp.isConfigured ? 'configured' : 'not configured'}`);
    console.log(`CORS origin: ${env.clientUrl}`);
  });
};

startServer();
