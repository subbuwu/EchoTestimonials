import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import clerkRoutes from '@/routes/clerk.routes';
import orgsRoutes from '@/routes/orgs.routes';
import projectsRoutes from '@/routes/projects.route';
import testimonialsRoutes from '@/routes/testimonials.route';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(clerkMiddleware());

// Webhook must be before express.json() to receive raw body
app.use('/api/clerk-webhook', clerkRoutes);

app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'healthy' });
});

app.use('/orgs', orgsRoutes);
app.use('/projects', projectsRoutes);
app.use('/testimonials', testimonialsRoutes);

// Export for Vercel serverless functions
export default app;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
