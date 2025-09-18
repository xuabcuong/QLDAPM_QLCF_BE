import pool from "./config/db";

async function main() {
  try {
    const [rows] = await pool.query("SELECT NOW() as now");
    console.log("Kết nối DB thành công:", rows);
  } catch (err) {
    console.error("Lỗi kết nối DB:", err);
  }
}

main();
