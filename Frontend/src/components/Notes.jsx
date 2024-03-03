// Notes.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Notes = () => {
  const { email } = useAuth();
  const { themeClass } = useTheme();

  const [notas, setNotas] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredTag, setFilteredTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = "https://wondernotes.onrender.com"
        const response = await fetch(`${apiUrl}/notes/?user_email=${email}`);
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const filteredNotas = data
          .filter((nota) => nota.user_email === email)
          .filter((nota) => !filteredTag || nota.tags.includes(filteredTag));

        setNotas(filteredNotas);

        const uniqueTags = Array.from(new Set(filteredNotas.flatMap((nota) => nota.tags)));
        setTags(uniqueTags);
      } catch (error) {
        console.error('Error fetching data:', error);
        setNotas([]);
        setTags([]);
      }
    };

    fetchData();
  }, [email, filteredTag]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-8 h-full ${themeClass}`}>
      {/* Navbar */}
      <div className={`col-span-1 ${themeClass} flex flex-col justify-center p-4`}>
        {filteredTag && (
          <button
            onClick={() => setFilteredTag('')}
            className={`bg-gray-400 hover:bg-gray-600 w-full ${themeClass} font-bold px-4 py-2 mb-4 rounded`}
          >
            Sin filtro
          </button>
        )}

        {/* Renderiza botones para cada tag */}
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilteredTag(tag)}
            className={`bg-gray-400 hover:bg-gray-600 w-full ${themeClass} font-bold px-4 py-2 mb-2 rounded`}
          >
            {tag}
          </button>
        ))}
      </div>

{/* Notas */}
<div className={`col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 ${themeClass}`}>
  {notas.length > 0 ? (
    notas.map((nota, index) => (
      <div key={index} className={`border border-white p-4 mb-4 rounded-lg text-justify ${themeClass}`}>
        <p className={`text-xl font-bold ${themeClass}`}>Título: {nota.header}</p>
        <p className={`text-gray-300 ${themeClass}`}>Cuerpo: {nota.body}</p>
        <p className={`text-gray-300 ${themeClass}`}>Tags: {nota.tags.join(', ')}</p>
      </div>
    ))
  ) : (
    <p className={`text-gray-300 ${themeClass}`}>No hay notas disponibles para este usuario.</p>
  )}
</div>



    </div>
  );
};

export default Notes;
