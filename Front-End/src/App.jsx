import React, { useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import OAuthCallback from './pages/OAuthCallback';

function App() {
  const { user, loading } = useApp();
  const [splashDone, setSplashDone] = useState(false);
  const initialLoad = useRef(true);

  // Cuma tampilkan splash pas load pertama aja, abis login gak usah
  const showSplash = initialLoad.current && (loading || !splashDone);

  return (
    <div className="min-h-screen bg-background">
      {/* Loading screen — matiin dulu, kode disimpen */}
      {/* {showSplash && (
        <AnimatedLoadingScreen onFinish={() => { setSplashDone(true); initialLoad.current = false; }} />
      )} */}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
