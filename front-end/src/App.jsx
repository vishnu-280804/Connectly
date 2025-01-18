import React, { useEffect } from 'react';
import "./index.css";
import { Navbar } from './components/Navbar.jsx';
import { SignUpPage } from './Pages/SignUpPage.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './Pages/LoginPage.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { SettingsPage } from './Pages/SettingsPage.jsx';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore.js';
import { ProfilePage } from './Pages/ProfilePage.jsx';
import HomePage from './Pages/HomePage.jsx';
import { Loader } from 'lucide-react';

export const App = () => {

  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      
      <Routes>
        <Route path="/" element={!authUser ? <Navigate to="/login" /> :<HomePage /> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      
      <Toaster />
    </div>
  );
};

export default App;
