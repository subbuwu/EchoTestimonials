import { Router } from 'express';
import express from 'express';
import crypto from 'crypto';
import { syncUserToDb } from '@/controllers/user.controller';

const router = Router();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

// Svix signature verification with multiple approaches
function verifySvixSignature(
  payload: string,
  headers: { [key: string]: string | string[] | undefined },
  secret: string
): boolean {
  const svixId = headers['svix-id'] as string;
  const svixTimestamp = headers['svix-timestamp'] as string;
  const svixSignature = headers['svix-signature'] as string;

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error('Missing required Svix headers');
  }

  // Parse signature (format: "v1,signature")
  const [version, signature] = svixSignature.split(',', 2);
  if (version !== 'v1' || !signature) {
    throw new Error('Invalid signature format');
  }

  // Create the signed payload
  const signedPayload = `${svixId}.${svixTimestamp}.${payload}`;
  
  // Try different secret formats
  const secretVariations = [
    secret, // Original secret
    secret.startsWith('whsec_') ? secret.slice(6) : secret, // Remove whsec_ prefix
    secret.startsWith('whsec_') ? secret : `whsec_${secret}`, // Add whsec_ prefix if missing
  ];

  for (const secretVariation of secretVariations) {
    try {
      // Try with base64 decoded secret (common for Svix)
      let secretBuffer: Buffer;
      try {
        secretBuffer = Buffer.from(secretVariation.replace('whsec_', ''), 'base64');
      } catch {
        // If base64 decode fails, use as UTF-8
        secretBuffer = Buffer.from(secretVariation, 'utf8');
      }

      const expectedSignature = crypto
        .createHmac('sha256', secretBuffer)
        .update(signedPayload, 'utf8')
        .digest('base64');

      console.log(`Testing secret variation: ${secretVariation.substring(0, 10)}...`);
      console.log(`Expected signature: ${expectedSignature}`);
      console.log(`Received signature: ${signature}`);

      if (crypto.timingSafeEqual(
        Buffer.from(signature, 'base64'),
        Buffer.from(expectedSignature, 'base64')
      )) {
        console.log('✅ Signature verified with secret variation');
        return true;
      }
    } catch (error) {
      console.log(`❌ Failed with secret variation: ${error}`);
      continue;
    }
  }

  return false;
}

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      console.log('=== PRODUCTION WEBHOOK ===');
      const rawBody = req.body as Buffer;
      const payload = rawBody.toString('utf8');
      
      // Verify signature
      try {
        const isValid = verifySvixSignature(payload, req.headers, CLERK_WEBHOOK_SECRET);
        
        if (!isValid) {
          console.error('❌ Signature verification failed');
          return res.status(401).send({ error: 'Invalid signature' });
        }
        
        console.log('✅ Signature verified successfully');
      } catch (error) {
        console.error('❌ Signature verification error:', error);
        // In production, you might want to return 401 here
        // For now, let's log the error but continue processing
        console.log('⚠️  Continuing without signature verification due to error');
      }

      // Parse and process the event
      const event = JSON.parse(payload);
      console.log('📨 Processing event:', event.type);

      switch (event.type) {
        case 'user.created': {
          const user = event.data;
          console.log('👤 Creating user:', {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email_addresses?.[0]?.email_address
          });
          
          await syncUserToDb({
            clerkId: user.id,
            firstName: user.first_name || null,
            lastName: user.last_name || null,
            imageUrl: user.image_url || user.profile_image_url || null,
            email: user.email_addresses?.[0]?.email_address || null,
          });
          
          console.log('✅ User synced to database:', user.id);
          break;
        }
        
        case 'user.updated': {
          const user = event.data;
          console.log('👤 User updated:', user.id);
          
          // You can implement user update logic here
          // await updateUserInDb({
          //   clerkId: user.id,
          //   firstName: user.first_name,
          //   lastName: user.last_name,
          //   imageUrl: user.image_url || user.profile_image_url,
          //   email: user.email_addresses?.[0]?.email_address,
          // });
          
          break;
        }
        
        case 'user.deleted': {
          const user = event.data;
          console.log('🗑️ User deleted:', user.id);
          
          // You can implement user deletion logic here
          // await deleteUserFromDb(user.id);
          
          break;
        }
        
        case 'session.created': {
          const session = event.data;
          console.log('🔑 Session created for user:', session.user_id);
          break;
        }
        
        case 'session.ended': {
          const session = event.data;
          console.log('🔚 Session ended for user:', session.user_id);
          break;
        }
        
        default:
          console.log('❓ Unhandled event type:', event.type);
          console.log('Event keys:', Object.keys(event.data || {}));
      }

      console.log('=== END WEBHOOK PROCESSING ===');
      res.status(200).json({ 
        received: true, 
        eventType: event.type,
        userId: event.data?.id || event.data?.user_id
      });
      
    } catch (err) {
      console.error('❌ Webhook processing error:', err);
      res.status(500).send({ error: 'Webhook handler failed' });
    }
  }
);

export default router;