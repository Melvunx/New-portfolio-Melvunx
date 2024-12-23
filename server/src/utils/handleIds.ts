import pool from "@config/database";
import { RowDataPacket } from "mysql2";

const { GET_REACTION_COUNTS_BY_ACCOUNT } = process.env;

const lowerCharacter = "azertyuiopmlkjhgfdsqwxcvbn";
const upperCharacter = lowerCharacter.toUpperCase();
const numbers = "0473291586";

export const idGenerator = () => {
  const loopValue = 15;
  let idsComponent = [...lowerCharacter, ...upperCharacter, ...numbers];
  let id = "";
  for (let i = 0; i < loopValue; i++) {
    id += idsComponent[Math.floor(Math.random() * idsComponent.length)];
  }

  return `_${id}`;
};

export const displayReactionCount = async (accountId: number) => {
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
      return { total_reactions: "No results" };
    }

    return reactionCounts.map(({ reaction_id, total_reactions }) => ({
      reaction_id,
      total_reactions,
    }));
  } catch (error) {
    throw error;
  }
};
