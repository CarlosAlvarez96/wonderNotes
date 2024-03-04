import { useState } from "react";
import { postNote } from "../Api/postNote";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

const NoteForm = () => {
  const { email } = useAuth();
  const navigate = useNavigate();
  const { themeClass } = useTheme();

  const [formData, setFormData] = useState({
    id: uuidv4(),
    user_email: email,
    header: "",
    body: "",
    tags: [],
  });
  const handleBodyChange = (e) => {
    setFormData({
      ...formData,
      body: e.target.value,
    });
  };
  const handleHeaderChange = (e) => {
    setFormData({
      ...formData,
      header: e.target.value,
    });
  };
  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.id]: e.target.value,
  //   });
  // };

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
        console.log("Nota creada exitosamente");
        Swal.fire({
          icon: "success",
          title: "Nota añadida exitosamente",
          text: "Tu nota ha sido añadida a la base de datos.",
        });
        navigate("/");
      } else {
        console.error("Error al crear la nota");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form
      className={`max-w-md mx-auto mt-10 p-6 ${themeClass} rounded-md shadow-md`}
      onSubmit={submitForm}
    >
     <label className="mt-4 block text-sm font-medium " htmlFor="header">
        Header:
      </label>
      <input
        className={`mt-1 p-2 w-full border rounded-md ${themeClass}`}
        type="text"
        id="header"
        value={formData.header}
        onChange={handleHeaderChange}
      />
      <div className={`mt-2 ${themeClass}`}>
        <ReactMarkdown>{formData.header}</ReactMarkdown>
      </div>
    <label className={`mt-4 block text-sm font-medium ${themeClass}`} htmlFor="body">
        Body:
      </label>
      <textarea
        className={`mt-1 p-2 w-full border rounded-md ${themeClass}`}
        type="text"
        id="body"
        value={formData.body}
        onChange={handleBodyChange}
      />
      <div className={`mt-2 ${themeClass}`}>
        <ReactMarkdown>{formData.body}</ReactMarkdown>
      </div>

      <label className={`mt-4 block text-sm font-medium`}>Tags:</label>
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            className={`mt-1 p-2 w-full border rounded-md ${themeClass}`}
            type="text"
            value={formData.tags[index] || ""}
            onChange={(e) => handleTagsChange(e, index)}
            placeholder={`Tag ${index + 1}`}
          />
        ))}
      </div>

      <button
        type="submit"
        className={`mt-4 ${themeClass} border border-opacity-75 border-spacing-4 border-gray-400 p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 ${themeClass}`}
      >
        Crear Nota
      </button>
    </form>
  );
};

export default NoteForm;
