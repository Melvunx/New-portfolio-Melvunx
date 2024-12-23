import pool from "@config/database";
import { RowDataPacket } from "mysql2";

const { GET_REACTION_COUNTS_BY_ACCOUNT } = process.env;

export const displayReactionCount = async (accountId: string) => {
  try {
    if (!GET_REACTION_COUNTS_BY_ACCOUNT) {
      throw new Error("Sql resquest not defined");
    } else if (!accountId) {
      throw new Error("Account id is undefined");
    }
    const [reactionCounts] = await pool.query<RowDataPacket[]>(
      GET_REACTION_COUNTS_BY_ACCOUNT,
      [accountId]
    );

    if (reactionCounts.length === 0) {
      return { total_reactions: "No result found" };
    }

    return reactionCounts.map(({ reaction_id, total_reactions }) => ({
      reaction_id,
      total_reactions,
    }));
  } catch (error) {
    throw error;
  }
};
