import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Lấy tên folder dựa vào route
    let folder = "default";

    if (req.baseUrl.includes("categories")) {
      folder = "category";
    } else if (req.baseUrl.includes("item")) {
      folder = "item";
    }

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const upload = multer({ storage });

export default upload;
