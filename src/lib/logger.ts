const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Errors should always be logged, even in production, so we can monitor them
    console.error(...args);
  }
};
