import { loggedHandleSuccess } from "@utils/handleMessageSuccess";
import { OkPacketParams, RowDataPacket } from "mysql2";

export const checkAffectedRow = (array: RowDataPacket[] & OkPacketParams) => {
  if (array.affectedRows === 0) throw new Error("Affected row is null");
  else
    loggedHandleSuccess("Row affected successfully", {
      rows: array.affectedRows,
    });
};
