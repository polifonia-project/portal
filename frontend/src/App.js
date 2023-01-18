import React from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import FeedPage from "./pages/Feed";
import DataStoriesPage from "./pages/DataStories";
import AboutPage from "./pages/About";
import Layout from "./components/layout/Layout";

function App() {
  const [pagetitle, setPageTitle] = useState();

  return (
    <Layout title={pagetitle}>
     <Routes>
        <Route path="/" element={<FeedPage func={setPageTitle}/>} />
        <Route path="/datastories" element={<DataStoriesPage func={setPageTitle}/>} />
        <Route path="/about" element={<AboutPage func={setPageTitle}/>} />
      </Routes>
    </Layout>
  );
}

export default App;