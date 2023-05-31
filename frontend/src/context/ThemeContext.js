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
    currentSection: 'cat_01',
    setCurrentSection: () => {},

  });