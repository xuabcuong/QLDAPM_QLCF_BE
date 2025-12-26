import "express";
import type { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // upload 1 file
      files?: Express.Multer.File[]; // upload nhiều file
      // user?: {
      //   id?: number;
      //   roleID?: number; // 👈 BỔ SUNG – OPTIONAL
      // };
    }
  }
}

export {};
