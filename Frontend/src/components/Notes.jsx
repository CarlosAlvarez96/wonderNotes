import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import deleteNote from "../Api/deleteNote";

const Notes = () => {
  const { email, token } = useAuth();
  const { themeClass } = useTheme();
  const [notas, setNotas] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredTag, setFilteredTag] = useState("");

  const fetchData = async () => {
    try {
      const apiUrl = "https://wondernotes.onrender.com";
      const response = await fetch(`${apiUrl}/notes/?user_email=${email}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const filteredNotas = data
        .filter((nota) => nota.user_email === email)
        .filter((nota) => !filteredTag || nota.tags.includes(filteredTag));

      setNotas(filteredNotas);

      const uniqueTags = Array.from(
        new Set(filteredNotas.flatMap((nota) => nota.tags))
      );
      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching data:", error);
      setNotas([]);
      setTags([]);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);

      setNotas((prevNotas) => prevNotas.filter((nota) => nota.id !== noteId));

      fetchData();
    } catch (error) {
      console.error(`Error al eliminar la nota con ID ${noteId}:`, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [email, filteredTag, token]);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-5 gap-4 h-full ${themeClass}`}>
      {/* Navbar */}
      <div className={`col-span-1 md:col-span-1 ${themeClass} flex flex-col justify-start p-4`}>
        <h2 className={`mx-auto mb-8 `}>Tags#</h2>
        {filteredTag && (
          <button
            onClick={() => setFilteredTag("")}
            className={`bg-gray-400 hover:bg-gray-600 w-full ${themeClass} font-bold px-2 py-1 mb-2 rounded`}
          >
            Sin filtro
          </button>
        )}

        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilteredTag(tag)}
            className={`bg-gray-400 hover:bg-gray-600 w-full ${themeClass} font-bold px-2 py-1 mb-1 rounded`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={`flex-1 col-span-4 p-4 ${themeClass}`}>
        {notas.length > 0 ? (
          notas.map((nota, index) => (
            <div
              key={index}
              className={`border border-white p-4 mb-4 rounded-lg text-justify flex flex-col ${themeClass}`}
            >
              <p className={`text-xl font-bold ${themeClass}`}>
                Título: <ReactMarkdown>{nota.header}</ReactMarkdown>
              </p>
              <br />
              <p className={` ${themeClass} font-bold`}>Cuerpo: </p>
              <br />
              <div className={` flex-1 overflow-auto p-4 ${themeClass}`}>
                <ReactMarkdown>{nota.body}</ReactMarkdown>
              </div>
              <br />
              <p className={` ${themeClass} font-bold`}>
                Tags: {nota.tags.join(", ")}
              </p>

              <button
                onClick={() => handleDeleteNote(nota.id)}
                className={` font-bold px-2 py-1 mt-2 rounded border ${themeClass}`}
              >
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className={` ${themeClass}`}>
            No hay notas disponibles para este usuario.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notes;
