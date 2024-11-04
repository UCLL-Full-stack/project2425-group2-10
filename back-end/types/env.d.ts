// back-end/types/env.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      // Add other variables as needed
    }
  }
  