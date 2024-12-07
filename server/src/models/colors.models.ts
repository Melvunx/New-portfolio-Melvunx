import { Color } from "@colors/colors";

const colors: TerminalColor = require("@colors/colors");

type Theme = {
  success: string;
  info: string;
  data: string[];
  warn: string;
  error: string[];
};

interface TerminalColor extends Color {
  setTheme: (theme: Theme) => void;
  success: any;
  info: any;
  data: any;
  warn: any;
  error: any;
}

colors.setTheme({
  success: "brightGreen",
  info: "cyan",
  data: ["gray", "italic"],
  warn: "brightYellow",
  error: ["red", "bgWhite"],
});

export default colors;
