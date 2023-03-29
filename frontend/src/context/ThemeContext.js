import { createContext } from "react";

export const ThemeContext = createContext({
    theme: "default",
    setTheme: () => {},
    soundOn: false,
    setSoundOn: () => {},
    cardOpen: false,
    setCardOpen: () => {},
    cardContent: {title: 'Card Title', cat: 'Card category', iri: 'Card iri', color: '#e5e3e3'},
    setContent: () => {},
    colorSet: {cat_01: '#f80000',
               cat_02: '#ff02fe', 
               cat_03: '#1d00fe', 
               cat_04: '#6400b4',
               cat_05: '#00feff',
               people: '#09ff00',
               places: '#fdff00',
               cat_08: '#000000',
              },

    setColorSet: () => {},
  });