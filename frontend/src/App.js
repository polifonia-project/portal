import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import FeedPage from "./pages/Feed";
import OutputsPage from "./pages/OutputsPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";
import CookiesPage from "./pages/CookiesPage";
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
      hasInput: false,
      goesBack: true
    });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, soundOn, setSoundOn, colorSet, setColorSet, backToTopOn, setbackToTopOn, currentSection, setCurrentSection }}>
      <CardContext.Provider value={{ cardOpen, setCardOpen, cardContent, setCardContent, cardBlocks, setCardBlocks, cardBlocksNew, setCardBlocksNew }}>
        <Layout title={pagetitle}>
          <Routes>
            <Route path="/portal" element={<FeedPage func={setPageTitle} />} />
            <Route path="/portal/outputs" element={<OutputsPage func={setPageTitle} />} />
            <Route path="/portal/terms" element={<TermsPage func={setPageTitle} />} />
            <Route path="/portal/cookies" element={<CookiesPage func={setPageTitle} />} />
            <Route path="/portal/about" element={<AboutPage func={setPageTitle} />} />
            <Route path="/portal/card" element={<CardPage func={setPageTitle} />} />
            <Route path='*' element={<NotFoundPage func={setPageTitle} />}/>
          </Routes>
        </Layout>
      </CardContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
