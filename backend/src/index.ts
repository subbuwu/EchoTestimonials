import express, { Application } from 'express';
import cors from './middlewares/cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { checkDBConnection } from './config/dbConnection';
import dotenv from "dotenv";
import morgan from 'morgan';

dotenv.config();
const app: Application = express();


//Global Middlewares
app.use(express.json());
app.use(cors);
app.use(morgan('dev'));

//Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// init server
const startServer = async () => {
    try {
      const isDatabaseConnected = await checkDBConnection();
      if (!isDatabaseConnected) {
        console.error('Server startup aborted due to database connection failure');
        process.exit(1);
      }
  
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();