// back-end/types/express/index.d.ts

import { AdminInfo } from '../../model/admin';

declare global {
  namespace Express {
    interface Request {
      adminId?: number;
      admin?: AdminInfo;
    }
  }
}
