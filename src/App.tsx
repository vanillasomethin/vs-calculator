import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ArchitectFee from './components/ArchitectFee';

const App = () => {
  return (
    <BrowserRouter basename="/vanilla-space-sculpt-63019">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<ArchitectFee />} />
          <Route path="/architect-fee" element={<ArchitectFee />} />
          {/* other routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
