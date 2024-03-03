// RootPage.js

import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';

const RootPage = () => {
  const { themeClass } = useTheme();
  console.log(themeClass);
  return (
      <div className={`min-h-screen flex flex-col ${themeClass}`}>
        {/* Header que ocupa el 100% del ancho */}
        <Header />

        {/* Contenedor principal con Tailwind Grid y altura completa */}
        <div className="grid grid-cols-1 md:grid-cols-8 flex-1 ">
          {/* Outlet que ocupa aproximadamente el 100% del ancho y la misma altura que el Nav */}
          <div className={`col-span-1 md:col-span-8 h-full ${themeClass}`}>
            <Outlet className={themeClass} />
          </div>
        </div>

        {/* Footer que ocupa el 100% del ancho */}
        <Footer />
      </div>
  );
};

export default RootPage;
