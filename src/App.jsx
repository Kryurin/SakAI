import React, { useState, useEffect } from 'react';
import { onAuthChange } from './services/firebaseService.js';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLoadRoute = (route) => {
    // Load route would populate the search form
    // This can be expanded later
    handlePageChange('home');
  };

  return (
    <div className="app">
      <Navbar user={user} onUserChange={setUser} />

      <main className="main-content">
        {currentPage === 'home' && <Home user={user} />}
        {currentPage === 'profile' && (
          <Profile user={user} onLoadRoute={handleLoadRoute} />
        )}
      </main>

      <footer className="app-footer">
        <p>
          SakAI © 2024 - Iloilo City Jeepney Commuting Guide
        </p>
        <p className="disclaimer">
          Routes are computer-generated based on known jeepney paths. Always verify with locals.
        </p>
      </footer>
    </div>
  );
}
