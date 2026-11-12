import express from 'express';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Running behind Caddy: trust the first proxy hop for req.ip / req.protocol.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(express.json());

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
