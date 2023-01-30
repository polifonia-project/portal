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
  const [sound, setSound] = useState('off');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, sound, setSound}}>
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
