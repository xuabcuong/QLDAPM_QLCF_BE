import { Request, Response } from "express";
import ItemModel, { Item } from "../models/item.model";

// Lấy tất cả item
export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await ItemModel.getAll();
    res.json(items);
    console.log("List product:", items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách item" });
  }
};

// Lấy item theo id
export const getItemById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const item = await ItemModel.getById(id);
    if (!item) {
      return res.status(404).json({ message: "Không tìm thấy item" });
    }
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy item" });
  }
};

// Tạo item mới

export const createItem = async (req: Request, res: Response) => {
  try {
    const { name, categoryID, isvailable, price } = req.body;

    // Cloudinary upload thành công thì multer-storage-cloudinary sẽ trả link ở req.file.path
    const imageURL = req.file ? (req.file as any).path : null;

    const newItem: Item = {
      name,
      categoryID: Number(categoryID),
      isvailable: Number(isvailable),
      price: Number(price),
      imageURL,
    };

    const id = await ItemModel.create(newItem);

    res.status(201).json({
      message: "Tạo item thành công",
      item: { id, ...newItem },
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo item:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật item
// export const updateItem = async (req: Request, res: Response) => {
//   try {
//     const id = Number(req.params.id);
//     // const item: Item = req.body;

    
//     console.log("Update item request body:", req.body);
//      const itemData: Partial<Item> = req.body;
   
//       const updateData: Partial<Item> = Object.fromEntries(
//       Object.entries(itemData).filter(([_, v]) => v !== null && v !== undefined)
//     );


//      const success = await ItemModel.update(id,updateData);
//      console.log("Update data:", updateData);
//     if (!success) {
//       return res.status(404).json({ message: "Không tìm thấy item" });
//     }

//     res.json({ message: "Cập nhật thành công", item: { id, ...updateData} });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Lỗi khi cập nhật item" });
//   }
// };
export const updateItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;
    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.categoryID !== undefined && body.categoryID !== "")
      updateData.categoryID = Number(body.categoryID);
    if (body.isavailable !== undefined && body.isavailable !== "")
      updateData.isavailable = Number(body.isavailable);

    if (req.file) {
      updateData.imageURL = req.file.filename; // hoặc req.file.path tùy bạn lưu
    }

    console.log("✅ Cleaned updateData:", updateData);

    const success = await ItemModel.update(id, updateData);
    if (!success) return res.status(404).json({ message: "Không tìm thấy item" });

    res.json({ message: "Cập nhật thành công", item: { id, ...updateData } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật item" });
  }
};

// Xóa item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await ItemModel.delete(id);

    if (!success) {
      return res.status(404).json({ message: "Không tìm thấy item" });
    }

    res.json({ message: "Xóa item thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa item" });
  }
};
