import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';

import Home from '../views/home/Home';
export default function IndexRouter() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // 监听 localStorage 中 token 的变化
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/*"
          element={<Home/>}
        />
      </Routes>
    </HashRouter>
  );
}
