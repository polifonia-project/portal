import { createContext } from "react";

export const CardContext = createContext({
  cardOpen: false,
  setCardOpen: () => {},
  cardContent: {title: 'Card Title', cat: 'Card category', input: 'inputname', uri: 'url', color: '#e5e3e3',hasInput: false, goesBack: true},
  setContent: () => {},
  cardBlocks: {},
  setCardBlocks: () => {},
  cardBlocksNew: {},
  setCardBlocksNew: () => {},
  });