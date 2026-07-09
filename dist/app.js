"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.clientUrl,
    credentials: true,
}));
app.use((0, morgan_1.default)(env_1.env.isProd ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Vidhaan Farmhouse API is running' });
});
// API routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/bookings', bookingRoutes_1.default);
app.use('/api/reviews', reviewRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/contact', contactRoutes_1.default);
// Error handling
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map