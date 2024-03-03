// En tu componente del navbar o donde sea apropiado
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { email } = useAuth();
  const [tags, setTags] = useState([]);
  const {setFilteredTag} = useAuth()
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/notes/?user_email=${email}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Filtra las notas por user_email y luego extrae tags únicas de las notas filtradas
        const filteredTags = Array.from(
          new Set(data.filter((nota) => nota.user_email === email).flatMap((nota) => nota.tags))
        );

        setTags(filteredTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setTags([]);
      }
    };

    fetchTags();
  }, [email]);
 
  return (
    <div className="bg-gray-800 flex flex-col justify-center h-full text-white p-4">
      <button 
          onClick={() => setFilteredTag("")}
          className="bg-gray-400 hover:bg-gray-600 w-1/ text-white font-bold px-6 py-2 m-auto rounded "
        ></button>
      {/* Renderiza botones para cada tag */}
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => setFilteredTag(tag)}
          className="bg-gray-400 hover:bg-gray-600 w-1/ text-white font-bold px-6 py-2 m-auto rounded "
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
