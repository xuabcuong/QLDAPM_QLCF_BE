import pool from "../config/db";

export async function getAllRoles() {
  const [rows] = await pool.query("SELECT * FROM roles");
  return rows;
}
