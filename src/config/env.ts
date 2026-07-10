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

  return '';
}

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/** Comma-separated CLIENT_URL values, trailing slashes stripped */
function parseClientUrls(): string[] {
  const raw = process.env.CLIENT_URL?.trim() || 'http://localhost:3000';
  const urls = raw
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

  return [...new Set(urls)];
}

function isMongoConfigured(): boolean {
  if (process.env.MONGODB_ENABLED === 'false') return false;
  return buildMongoUri().length > 0;
}

const mongodbUri = buildMongoUri();

export const env = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',

  mongodb: {
    enabled: isMongoConfigured(),
    uri: mongodbUri,
    /** When true, the process exits if MongoDB cannot connect */
    required: process.env.MONGODB_REQUIRED === 'true',
  },

  /** @deprecated Use env.mongodb.uri */
  mongodbUri,

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

  clientUrl: parseClientUrls()[0] || 'http://localhost:3000',
  clientUrls: parseClientUrls(),

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: (process.env.SMTP_USER || '').trim(),
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    from: (process.env.SMTP_FROM || process.env.SMTP_USER || 'reservations@vidhaan.com').trim(),
    adminEmail: (process.env.ADMIN_EMAIL || '').trim(),
    ownerEmail: (process.env.OWNER_EMAIL || process.env.ADMIN_EMAIL || '').trim(),
    isConfigured: !!(
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.replace(/\s+/g, '')
    ),
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
