import colors from "@/schema/colors.schema";
import bcrypt from "bcrypt";

const { SALT_ROUNDS } = process.env;

const lowerCharacter = "azertyuiopmlkjhgfdsqwxcvbn";
const symbolsCharacter = ",?;./:!§£*µù%^\"'éèàç([)@){=}]#~&";
const numbers = "0473291586";

export class Generator {
  loop: number;
  lowerCharacter: string;
  symbolsCharacter: string;
  numbers: string;

  constructor(
    loop: number,
    lowerCharacter = "azertyuiopmlkjhgfdsqwxcvbn",
    symbolsCharacter = ",?;./:!§£*µù%^\"'éèàç([)@){=}]#~&",
    numbers = "0473291586"
  ) {
    this.loop = loop;
    this.lowerCharacter = lowerCharacter;
    this.symbolsCharacter = symbolsCharacter;
    this.numbers = numbers;
  }

  generateIds() {
    let idSelector = [
      ...lowerCharacter,
      ...numbers,
      ...lowerCharacter.toUpperCase(),
    ];

    let id = "";

    for (let i = 0; i < this.loop; i++) {
      id += idSelector[Math.floor(Math.random() * idSelector.length)];
    }

    console.log(colors.info(`generated id : _${id}`));

    return `_${id}`;
  }

  generatePassword() {
    let passportSelector = [
      ...numbers,
      ...lowerCharacter.toUpperCase(),
      ...symbolsCharacter,
      ...lowerCharacter,
    ];
    let password = "";

    for (let i = 0; i < this.loop; i++) {
      password +=
        passportSelector[Math.floor(Math.random() * passportSelector.length)];
    }

    return password;
  }

  generateHasshedPassword(password: string) {
    const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS) || 10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
  }
}
