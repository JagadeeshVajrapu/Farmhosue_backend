"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
function maskMongoUri(uri) {
    return uri.replace(/:([^:@/]+)@/, ':****@');
}
/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.env.mongodbUri, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    }
    catch (error) {
        const err = error;
        console.error('MongoDB connection error:', error);
        console.error(`Connection target: ${maskMongoUri(env_1.env.mongodbUri)}`);
        if (err.code === 8000 || err.message?.includes('authentication failed')) {
            console.error('\nAtlas auth failed. Check in MongoDB Atlas → Database Access:\n' +
                '  • Username and password match MONGODB_USER / MONGODB_PASSWORD in .env\n' +
                '  • Use the raw password (e.g. webfastDb@2330) — do not manually encode @ as %40\n' +
                '  • Or paste the full connection string from Atlas as MONGODB_URI\n');
        }
        process.exit(1);
    }
};
exports.connectDB = connectDB;
mongoose_1.default.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});
//# sourceMappingURL=database.js.map