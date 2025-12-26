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
  static async getAllAccount(): Promise<Account[]> {
    const [rows] = await pool.query(
      "SELECT id, name, full_name, phoneNumber, roleID, status  FROM accounts"
    );

    return rows as Account[];
  }

  static async getOneAccount(id: number): Promise<Account[]> {
    const [rows] = await pool.query(
      "SELECT id, name, full_name, phoneNumber, roleID, status  FROM accounts WHERE id =?",
      [id]
    );

    return rows as Account[];
  }

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

  static async getnameStaff(id: number) {
    const [rows] = await pool.query(
      "SELECT full_name FROM accounts WHERE id = ?",
      [id]
    );
    const result = rows as { full_name: string }[];
    return result.length > 0 ? result[0].full_name : null;
  }

  static async updateAccount(id: number, account: Partial<Account>) {
    const fields: string[] = [];
    const values: any[] = [];

    if (account.full_name !== undefined) {
      fields.push("full_name = ?");
      values.push(account.full_name);
    }

    if (account.phoneNumber !== undefined) {
      fields.push("phoneNumber = ?");
      values.push(account.phoneNumber);
    }

    if (account.roleID !== undefined) {
      fields.push("roleID = ?");
      values.push(account.roleID);
    }

    if (account.status !== undefined) {
      fields.push("status = ?");
      values.push(account.status);
    }

    if (!fields.length) {
      throw new Error("Không có dữ liệu nào để cập nhật!");
    }

    const sql = `UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const [resultUpdateAccount] = await pool.query(sql, values);
    return resultUpdateAccount;
  }
}
