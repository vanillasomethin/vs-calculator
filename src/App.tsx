import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Import pages
import Index from './pages/Index';
import ArchitectFeeCalculator from './pages/ArchitectFeeCalculator';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter basename="/vanilla-space-sculpt-63019">
          <Routes>
            {/* Main Estimator - starts at root */}
            <Route path="/" element={<Index />} />
            <Route path="/estimator" element={<Index />} />
            
            {/* Detailed Architect Fee Calculator */}
            <Route path="/architect-fee" element={<ArchitectFeeCalculator />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
