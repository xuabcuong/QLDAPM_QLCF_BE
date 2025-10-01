import express from "express";
import dotenv from "dotenv";
import roleRoutes from "./routes/role.routes";
import authRoutes from "./routes/auth.routes";
import categoriRoutes from "./routes/category.routes";
import itemRoutes from "./routes/item.routes";
import tableRoutes from "./routes/table.route";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.routes";

import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());

const PORT = process.env.PORT;
console.log("🚀 ~ process.env.PORT:", process.env.PORT);

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/api/categories", categoriRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} ✅ `);
});
