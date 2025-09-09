// src/components/Layout.jsx
import React from 'react';
import HeroSection from './HeroSection';

const Layout = ({ children }) => {
  return (
    <div>
      <HeroSection /> {/* Automatically shown on all pages using this layout */}
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
