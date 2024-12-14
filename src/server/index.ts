import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from '../config/env';
import { db } from '../config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import apiRouter from './routes/api';

const app = express();

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(morgan(env.LOG_FORMAT));
app.use(express.json());
app.use(requestLogger);

// API routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

// Initialize database and start server
const PORT = env.PORT;

db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});