import { createContext } from "react";

export const ThemeContext = createContext({
    theme: "default",
    setTheme: () => {},
    soundOn: false,
    setSoundOn: () => {},
    cardOpen: false,
    setCardOpen: () => {},
    cardContent: {title: 'Card Title', cat: 'Card category', iri: 'Card iri', color: 'red'},
    setContent: () => {},
  });