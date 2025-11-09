import { Server, Socket } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("✅ New client:", socket.id);

    socket.on("newOrder", (order) => {
      io.emit("notifyBar", order);
    });

    socket.on("orderCompleted", (order) => {
      io.emit("notifyWaiter", order);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
