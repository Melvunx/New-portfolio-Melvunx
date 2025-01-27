import bcrypt from "bcrypt";

const { SALT_ROUNDS } = process.env;

class Generator {
  public loop: number;
  public lowerCharacter: string;
  public symbolsCharacter: string;
  public numbers: string;

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

  generatePassword() {
    let passportSelector = [
      ...this.numbers,
      ...this.lowerCharacter.toUpperCase(),
      ...this.symbolsCharacter,
      ...this.lowerCharacter,
    ];
    let password = "";

    for (let i = 0; i < this.loop; i++) {
      password +=
        passportSelector[Math.floor(Math.random() * passportSelector.length)];
    }

    return password;
  }

  async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}

const generator = new Generator(14);

export default generator;
