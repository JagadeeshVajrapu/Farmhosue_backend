"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const startServer = async () => {
    const dbConnected = await (0, database_1.connectDB)();
    app_1.default.listen(env_1.env.port, () => {
        console.log(`Vidhaan Farmhouse API running on port ${env_1.env.port}`);
        console.log(`Environment: ${env_1.env.nodeEnv}`);
        console.log(`Database: ${dbConnected ? 'connected' : env_1.env.mongodb.enabled ? 'unavailable' : 'disabled'}`);
        console.log(`SMTP: ${env_1.env.smtp.isConfigured ? 'configured' : 'not configured'}`);
        console.log(`CORS origin: ${env_1.env.clientUrl}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map