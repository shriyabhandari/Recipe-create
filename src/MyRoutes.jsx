import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Recipes from './Pages/Recipes'; // Ensure this path matches your structure

const MyRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/recipes" element={<Recipes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MyRoutes;
