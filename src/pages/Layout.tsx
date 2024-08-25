// Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className='pt-10 mt-3'>{/* Adjust padding to fit header and footer height */}
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
