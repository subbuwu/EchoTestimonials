"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_2 = require("@clerk/express");
const clerk_routes_1 = __importDefault(require("@/routes/clerk.routes"));
const orgs_routes_1 = __importDefault(require("@/routes/orgs.routes"));
const projects_route_1 = __importDefault(require("@/routes/projects.route"));
const testimonials_route_1 = __importDefault(require("@/routes/testimonials.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, express_2.clerkMiddleware)());
// Webhook must be before express.json() to receive raw body
app.use('/api/clerk-webhook', clerk_routes_1.default);
app.use(express_1.default.json());
app.get('/health', (_, res) => {
    res.json({ status: 'healthy' });
});
app.use('/orgs', orgs_routes_1.default);
app.use('/projects', projects_route_1.default);
app.use('/testimonials', testimonials_route_1.default);
// Export for Vercel serverless functions
exports.default = app;
// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
