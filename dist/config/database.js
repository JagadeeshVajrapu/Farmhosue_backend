"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
exports.isDbConnected = isDbConnected;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
function maskMongoUri(uri) {
    return uri.replace(/:([^:@/]+)@/, ':****@');
}
/** Whether MongoDB is currently connected */
function isDbConnected() {
    return mongoose_1.default.connection.readyState === 1;
}
/**
 * Connect to MongoDB when configured. Returns false when disabled or connection fails
 * (unless MONGODB_REQUIRED=true, which exits the process on failure).
 */
const connectDB = async () => {
    if (!env_1.env.mongodb.enabled) {
        console.log('[MongoDB] Disabled — API runs in email-only mode (no database)');
        return false;
    }
    if (!env_1.env.mongodb.uri) {
        console.warn('[MongoDB] Enabled but no connection string found — skipping database');
        return false;
    }
    try {
        const conn = await mongoose_1.default.connect(env_1.env.mongodb.uri, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
        return true;
    }
    catch (error) {
        const err = error;
        console.error('MongoDB connection error:', error);
        console.error(`Connection target: ${maskMongoUri(env_1.env.mongodb.uri)}`);
        if (err.code === 8000 || err.message?.includes('authentication failed')) {
            console.error('\nAtlas auth failed. Check in MongoDB Atlas → Database Access:\n' +
                '  • Username and password match MONGODB_USER / MONGODB_PASSWORD in .env\n' +
                '  • Use the raw password (e.g. webfastDb@2330) — do not manually encode @ as %40\n' +
                '  • Or paste the full connection string from Atlas as MONGODB_URI\n');
        }
        if (env_1.env.mongodb.required) {
            process.exit(1);
        }
        console.warn('[MongoDB] Connection failed — server will continue without database (contact form uses email only)');
        return false;
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
//# sourceMappingURL=database.js.map