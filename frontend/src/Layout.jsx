import React, { useContext } from 'react';
import { Navbar } from "./components/Navbar/Navbar";
import { ThemeContext } from './components/ThemeContext/ThemeContext';
import { Advertisment } from './components/Advertisment/Advertisment';


const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar />
      <Advertisment />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;