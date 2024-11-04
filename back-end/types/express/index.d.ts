// back-end/types/express/index.d.ts

import { Application } from '../../model/application';
import { AdminInfo } from '../../model/admin';
import { User } from '../../model/user'; // Ensure this path is correct
import { UserInfo } from '../../model/user';

declare global {
  namespace Express {
    interface Request {
      adminId?: number;
      admin?: AdminInfo;
      user?: UserInfo;
      userId?: number; // For authenticated users
      application?: Application;
      // Add other custom properties if necessary
    }
  }
}
