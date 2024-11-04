// back-end/utils/typeGuards.ts

import { Request } from 'express';
import { Multer } from 'multer';

export const isMulterFileArray = (
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined
): files is { [fieldname: string]: Express.Multer.File[] } => {
  return files !== undefined && typeof files === 'object' && !Array.isArray(files);
};
