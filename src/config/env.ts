import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/** Build Atlas URI with correct password encoding (use raw password in .env, not %40) */
function buildMongoUri(): string {
  const directUri = process.env.MONGODB_URI?.trim();
  if (directUri) return directUri;

  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const cluster = process.env.MONGODB_CLUSTER?.trim();
  const database = process.env.MONGODB_DATABASE?.trim() || 'vidhaan_farmhouse';

  if (user && password && cluster) {
    const encodedUser = encodeURIComponent(user);
    const encodedPass = encodeURIComponent(password);
    return `mongodb+srv://${encodedUser}:${encodedPass}@${cluster}/${database}?retryWrites=true&w=majority&appName=Cluster0`;
  }

  return 'mongodb://localhost:27017/vidhaan-farmhouse';
}

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',

  mongodbUri: buildMongoUri(),

  jwt: {
    secret: requireEnv('JWT_SECRET', 'dev-secret-change-in-production'),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    isConfigured: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'reservations@vidhaan.com',
    adminEmail: process.env.ADMIN_EMAIL || '',
    ownerEmail: process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL || '',
    isConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
  },

  whatsapp: {
    adminPhone: process.env.WHATSAPP_ADMIN_PHONE || '919876543210',
    webhookUrl: process.env.WHATSAPP_WEBHOOK_URL || '',
  },

  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
    isConfigured: !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM
    ),
  },
} as const;
