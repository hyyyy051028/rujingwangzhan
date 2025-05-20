import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// 私有路由组件
const PrivateRouter = ({ children }) => {
  // 检查用户是否登录以及是否有权限访问
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

  // 如果没有权限，重定向到登录页面
  // if (!token) {
  //   return <Navigate to="/home" replace />;
  // }

  // 如果有权限，渲染子组件
  return children;
};

export default PrivateRouter;