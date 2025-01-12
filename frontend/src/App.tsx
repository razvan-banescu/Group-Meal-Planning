import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RoomProvider } from './contexts/RoomContext';
import { useRoom } from './contexts/RoomContext';
import toast from 'react-hot-toast';

// Protected route component that checks if room exists
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { room } = useRoom();
  
  if (!room) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const Header: React.FC = () => {
  const { room } = useRoom();

  const handleCopyToClipboard = async () => {
    if (room?.seed) {
      const roomUrl = `${window.location.origin}/room/${room.seed}`;
      await navigator.clipboard.writeText(roomUrl);
      toast.success('Room link copied to clipboard! 🎊');
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16 items-center">
          <div className="flex items-center whitespace-nowrap">
            <span className="text-2xl font-serif text-violet-600">🐰 Easter Planner</span>
            {room?.seed && (
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center text-xl text-violet-400 ml-2 hover:text-violet-500 focus:outline-none focus:text-violet-500 transition-colors duration-200"
              >
                #{room.seed}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            )}
            <span className="text-2xl font-serif text-violet-600 ml-2">🌸</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const App: React.FC = () => {
  return (
    <RoomProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route 
              path="/room/:seed" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </RoomProvider>
  );
}; 