import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;      // cho upload 1 file
      files?: Express.Multer.File[];   // nếu upload nhiều file
    }
  }
}
