// back-end/types/express/index.d.ts

import 'express';
import { Express } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        files: { [fieldname: string]: Express.Multer.File[] };
    }
}
