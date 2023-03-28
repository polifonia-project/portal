import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import FeedPage from "./pages/Feed";
import DataStoriesPage from "./pages/DataStories";
import AboutPage from "./pages/About";
import Layout from "./components/layout/Layout";
import { ThemeContext } from "./context/ThemeContext";

function App() {
  const [pagetitle, setPageTitle] = useState();
  const [theme, setTheme] = useState('default');
  const [soundOn, setSoundOn] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardContent, setCardContent] = useState({title: 'Card Title', cat: 'Card category', iri: 'Card iri', color: '#e5e3e3'});

  return (
    <ThemeContext.Provider value={{ theme, setTheme, soundOn, setSoundOn, cardOpen, setCardOpen, cardContent, setCardContent}}>
      <Layout title={pagetitle}>
        <Routes>
          <Route path="/" element={<FeedPage func={setPageTitle} />} />
          <Route path="/datastories" element={<DataStoriesPage func={setPageTitle} />}/>
          <Route path="/about" element={<AboutPage func={setPageTitle} />} />
        </Routes>
      </Layout>
    </ThemeContext.Provider>
  );
}

export default App;
