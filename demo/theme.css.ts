import { createReveTheme } from "../src/theme";

export const theme = createReveTheme({
  static: {
    size: (value: number) => `${value}px`,
  },
  dynamic: {
    ".light-theme": {
      color: { background: "lightblue" },
    },
    ".dark-theme": {
      color: { background: "lightpink" },
    },
  },
});
