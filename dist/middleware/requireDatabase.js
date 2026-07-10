"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireDatabase = requireDatabase;
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const errorHandler_1 = require("./errorHandler");
/** Block routes that need MongoDB when the database is disabled or disconnected */
function requireDatabase(_req, _res, next) {
    if (!env_1.env.mongodb.enabled) {
        return next((0, errorHandler_1.createError)('Database is disabled. Enquiry submissions are handled by email only.', 503));
    }
    if (!(0, database_1.isDbConnected)()) {
        return next((0, errorHandler_1.createError)('Database is unavailable. Please try again later.', 503));
    }
    next();
}
//# sourceMappingURL=requireDatabase.js.map