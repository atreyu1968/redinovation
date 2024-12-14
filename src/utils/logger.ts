// Simple logger implementation
export const log = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  debug: (...args: any[]) => console.debug('[DEBUG]', ...args),
};

// Request logger middleware
export const logger = (req: any, res: any, next: any) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
};