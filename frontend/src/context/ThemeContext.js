import { createContext } from "react";

export const ThemeContext = createContext({
    theme: "default",
    setTheme: () => {},
    soundOn: false,
    setSoundOn: () => {},
    backToTopOn: false, 
    setbackToTopOn: () => {},
    colorSet: {},
    setColorSet: () => {},
  });