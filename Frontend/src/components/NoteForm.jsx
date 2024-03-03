import { useState } from 'react';
import { postNote } from '../Api/postNote';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NoteForm = () => {
  const { email } = useAuth();
  const navigate = useNavigate();
  const { themeClass } = useTheme();
  console.log('Theme class in NoteForm:', themeClass);

  const [formData, setFormData] = useState({
    id: '1',
    user_email: email,
    header: '',
    body: '',
    tags: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleTagsChange = (e, tagIndex) => {
    const updatedTags = [...formData.tags];
    updatedTags[tagIndex] = e.target.value;

    setFormData({
      ...formData,
      tags: updatedTags,
    });
  };

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      const response = await postNote(formData);

      if (response.ok) {
        console.log('Nota creada exitosamente');
        Swal.fire({
          icon: 'success',
          title: 'Nota añadida exitosamente',
          text: 'Tu nota ha sido añadida a la base de datos.',
        });
        navigate("/");
      } else {
        console.error('Error al crear la nota');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <form className={`max-w-md mx-auto mt-10 p-6 ${themeClass} rounded-md shadow-md`} onSubmit={submitForm}>
      <label className="mt-4 block text-sm font-medium" htmlFor="header">
        Header:
      </label>
      <input
        className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-gray-200"
        type="text"
        id="header"
        value={formData.header}
        onChange={handleChange}
      />
      <label className="mt-4 block text-sm font-medium" htmlFor="body">
        Body:
      </label>
      <textarea
        className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-gray-200"
        type="text"
        id="body"
        value={formData.body}
        onChange={handleChange}
      />

      {/* Campos de tags */}
      <label className="mt-4 block text-sm font-medium">Tags:</label>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            className="mt-1 p-2 w-full border rounded-md bg-gray-700 text-gray-200"
            type="text"
            value={formData.tags[index] || ''}
            onChange={(e) => handleTagsChange(e, index)}
            placeholder={`Tag ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="submit"
        className={`mt-4 bg-blue-500 text-white rounded-md p-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 ${themeClass}`}
      >
        Crear Nota
      </button>
    </form>
  );
};

export default NoteForm;
