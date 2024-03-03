// Footer.js
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { themeClass } = useTheme();
  console.log(themeClass);

  return (
    <div>
      <footer className={`flex flex-row justify-around p-4 ${themeClass}`}>
        <h2 className="text-2xl font-bold p-2 m-2">Proyecto para Horas de libre configuración</h2>
        <h2 className="text-2xl font-bold p-2 m-2">Carlos Álvarez Martín</h2>
      </footer>
    </div>
  );
};

export default Footer;
