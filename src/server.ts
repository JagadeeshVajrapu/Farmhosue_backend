import app from './app';
import { connectDB } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`Vidhaan Farmhouse API running on port ${env.port}`);
    console.log(`Environment: ${env.nodeEnv}`);
  });
};

startServer();
