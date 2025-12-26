import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import roleRoutes from "./routes/role.routes";
import authRoutes from "./routes/auth.routes";
import categoriRoutes from "./routes/category.routes";
import itemRoutes from "./routes/item.routes";
import tableRoutes from "./routes/table.route";
import orderRoutes from "./routes/order.route";
import paymentRoutes from "./routes/payment.routes";
import statisticalRoutes from "./routes/statistical.routes";

import { initSocket } from "./socket/socketHandler"; // 👈 Tạo file này ở bước dưới.

dotenv.config();

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.IO
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://frontend-qldapm-fo6c.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // 🔥 QUAN TRỌNG
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/api/categories", categoriRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/statistical", statisticalRoutes);

// Khởi tạo socket
initSocket(io); // 👈 Gọi hàm xử lý sự kiện

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
