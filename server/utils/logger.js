import morgan from 'morgan';
import { env } from '../config/env.js';

// Custom token for request ID
morgan.token('reqId', (req) => req.id);

// Custom format for development
const devFormat = ':reqId :method :url :status :response-time ms';

// Custom format for production
const prodFormat = ':reqId :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const logger = morgan(env.NODE_ENV === 'development' ? devFormat : prodFormat, {
  skip: (req, res) => env.NODE_ENV === 'test'
});

// Application logger
export const log = {
  error: (...args) => {
    if (env.LOG_LEVEL === 'error') console.error(...args);
  },
  warn: (...args) => {
    if (['error', 'warn'].includes(env.LOG_LEVEL)) console.warn(...args);
  },
  info: (...args) => {
    if (['error', 'warn', 'info'].includes(env.LOG_LEVEL)) console.info(...args);
  },
  debug: (...args) => {
    if (['error', 'warn', 'info', 'debug'].includes(env.LOG_LEVEL)) console.debug(...args);
  }
};