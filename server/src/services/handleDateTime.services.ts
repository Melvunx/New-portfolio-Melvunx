import pool from "@/config/database";
import { OkPacketParams, RowDataPacket } from "mysql2";

export const updateDateTime = async (
  table: string,
  id: string,
  row = "updatedAt"
) => {
  try {
    const UPDATE_DATETIME = `UPDATE ${table} SET ${row} = CURRENT_TIMESTAMP WHERE id = ?`;

    const [updateData] = await pool.query<RowDataPacket[] & OkPacketParams>(
      UPDATE_DATETIME,
      [id]
    );

    if (updateData.affectedRows === 0) {
      throw new Error("Update data failed !");
    }
    console.log("Data updated successfully !");
  } catch (error) {
    throw error;
  }
};
