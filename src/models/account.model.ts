// src/models/accountModel.ts
import pool from "../config/db";

export interface Account {
  id?: number;
  name: string;
  passwordHash: string;
  roleID?: number;
  status?: number;
  full_name?: string;
  phoneNumber?: string;
}

export default class AccountModel {
  // Tìm user theo username
  static async findByName(name: string) {
    const [rows] = await pool.query("SELECT * FROM accounts WHERE name = ?", [
      name,
    ]);
    const result = rows as Account[];
    return result.length > 0 ? result[0] : null;
  }


  static async create(account: Account) {
    await pool.query(
      "INSERT INTO accounts (name, passwordHash, full_name, phoneNumber, roleID, status) VALUES (?, ?, ?, ?, ?, 1)",
      [
        account.name,
        account.passwordHash,
        account.full_name || "",
        account.phoneNumber || "",
        account.roleID || null,
      ]
    );
  }
}
