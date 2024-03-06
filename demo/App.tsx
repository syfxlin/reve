import { useState } from "react";
import { container } from "./App.css.ts";

export default function App() {
  const [theme, setTheme] = useState<string>("light-theme");
  return (
    <div className={theme}>
      <button
        onClick={() =>
          setTheme(t => (t === "light-theme" ? "dark-theme" : "light-theme"))}
      >
        {theme}
      </button>
      <div className={container}>Test</div>
    </div>
  );
}
