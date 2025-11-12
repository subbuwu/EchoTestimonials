import { Router } from 'express';
import express from 'express';
import { Webhook } from 'svix';
import { syncUserToDb, deleteUserFromDb } from '@/controllers/user.controller';

const router = Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

if (!CLERK_WEBHOOK_SECRET) {
  throw new Error('CLERK_WEBHOOK_SECRET environment variable is required');
}

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const payload = req.body as Buffer;
      const headers = req.headers;

    // Verify webhook signature
      const wh = new Webhook(CLERK_WEBHOOK_SECRET);
      let evt: any;

      try {
        const svixHeaders = {
          'svix-id': headers['svix-id'] as string,
          'svix-timestamp': headers['svix-timestamp'] as string,
          'svix-signature': headers['svix-signature'] as string,
        };
        evt = wh.verify(payload, svixHeaders);
      } catch (err) {
      console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ error: 'Invalid signature' });
      }

      const eventType = evt.type;
          const { id, first_name, last_name, email_addresses, image_url } = evt.data;
          const email = email_addresses?.[0]?.email_address;
          
    switch (eventType) {
      case 'user.created':
      case 'user.updated':
          await syncUserToDb({
            clerkId: id,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            email: email || null,
          });
          break;
        
      case 'user.deleted':
          await deleteUserFromDb(id);
          break;
        
        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

    res.status(200).json({ received: true, eventType, userId: id });
    } catch (err) {
    console.error('Webhook processing error:', err);
      res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export default router;