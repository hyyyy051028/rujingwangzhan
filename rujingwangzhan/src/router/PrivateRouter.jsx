import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// 私有路由组件
const PrivateRouter = ({ children }) => {
  // 检查用户是否登录以及是否有权限访问
  // 首先检查localStorage，然后检查sessionStorage
  const [token, setToken] = useState(
    localStorage.getItem('token') || sessionStorage.getItem('token')
  );

  useEffect(() => {
    // 定义一个函数来检查token
    const checkToken = () => {
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      setToken(localToken || sessionToken);
    };

    // 监听 storage 中 token 的变化
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkToken();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 定期检查token，以防sessionStorage中的token被其他标签页修改
    const intervalId = setInterval(checkToken, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  // 如果没有权限，重定向到登录页面
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 如果有权限，渲染子组件
  return children;
};

export default PrivateRouter;