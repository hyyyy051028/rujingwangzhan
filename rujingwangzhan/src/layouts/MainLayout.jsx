import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderHome from '../components/header';
import FooterHome from '../components/footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderHome />
      <Outlet />
      <FooterHome />
    </div>
  );
};

export default MainLayout;
