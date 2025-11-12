"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const svix_1 = require("svix");
const user_controller_1 = require("@/controllers/user.controller");
const router = (0, express_1.Router)();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET environment variable is required');
}
router.post('/', express_2.default.raw({ type: 'application/json' }), async (req, res) => {
    var _a;
    try {
        const payload = req.body;
        const headers = req.headers;
        // Verify webhook signature
        const wh = new svix_1.Webhook(CLERK_WEBHOOK_SECRET);
        let evt;
        try {
            const svixHeaders = {
                'svix-id': headers['svix-id'],
                'svix-timestamp': headers['svix-timestamp'],
                'svix-signature': headers['svix-signature'],
            };
            evt = wh.verify(payload, svixHeaders);
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err);
            return res.status(400).json({ error: 'Invalid signature' });
        }
        const eventType = evt.type;
        const { id, first_name, last_name, email_addresses, image_url } = evt.data;
        const email = (_a = email_addresses === null || email_addresses === void 0 ? void 0 : email_addresses[0]) === null || _a === void 0 ? void 0 : _a.email_address;
        switch (eventType) {
            case 'user.created':
            case 'user.updated':
                await (0, user_controller_1.syncUserToDb)({
                    clerkId: id,
                    firstName: first_name || null,
                    lastName: last_name || null,
                    imageUrl: image_url || null,
                    email: email || null,
                });
                break;
            case 'user.deleted':
                await (0, user_controller_1.deleteUserFromDb)(id);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }
        res.status(200).json({ received: true, eventType, userId: id });
    }
    catch (err) {
        console.error('Webhook processing error:', err);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
});
exports.default = router;
