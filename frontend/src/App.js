import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import FeedPage from "./pages/Feed";
import DataStoriesPage from "./pages/DataStories";
import AboutPage from "./pages/About";
import CardPage from "./pages/CardPage";
import Layout from "./components/layout/Layout";
import { ThemeContext } from "./context/ThemeContext";
import { CardContext } from "./context/CardContext";

function App() {
  const [pagetitle, setPageTitle] = useState();

  const [theme, setTheme] = useState('default');
  const [soundOn, setSoundOn] = useState(false);
  const [backToTopOn, setbackToTopOn] = useState(false);
  const [colorSet, setColorSet] = useState({});
  const [currentSection, setCurrentSection] = useState('cat_01');

  const [cardOpen, setCardOpen] = useState(false);
  const [cardBlocks, setCardBlocks] = useState({});
  const [cardBlocksNew, setCardBlocksNew] = useState({});
  const [cardContent, setCardContent] = useState(
    {
      title: 'Card Title',
      cat: 'Card category',
      input: 'Input name',
      uri: 'url',
      color: '#e5e3e3',
      hasInput: false
    });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, soundOn, setSoundOn, colorSet, setColorSet, backToTopOn, setbackToTopOn, currentSection, setCurrentSection }}>
      <CardContext.Provider value={{ cardOpen, setCardOpen, cardContent, setCardContent, cardBlocks, setCardBlocks, cardBlocksNew, setCardBlocksNew }}>
        <Layout title={pagetitle}>
          <Routes>
            <Route path="/" element={<FeedPage func={setPageTitle} />} />
            <Route path="/datastories" element={<DataStoriesPage func={setPageTitle} />} />
            <Route path="/about" element={<AboutPage func={setPageTitle} />} />
            <Route path="/card/:cat/:uri" element={<CardPage />} />
          </Routes>
        </Layout>
      </CardContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
