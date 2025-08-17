import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express'
import clerkRoutes from "@/routes/clerk.routes"
import orgsRoutes from "@/routes/orgs.routes"

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(clerkMiddleware())
app.use('/api/clerk-webhook', clerkRoutes);
app.use(express.json())

app.get('/health', (_, res) => {
  res.json({ status: 'healthy' });
});


// app.use('/users', userRoutes);
app.use('/orgs',orgsRoutes)

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
