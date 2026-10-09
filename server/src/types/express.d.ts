// src/types/express.d.ts
import { JwtPayload } from './custom.types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};