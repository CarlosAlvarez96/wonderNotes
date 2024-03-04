const deleteNote = async (noteId) => {
    try {
      const apiUrl = "https://wondernotes.onrender.com";
      const response = await fetch(`${apiUrl}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
        },
      });
  
      if (response.ok) {
        console.log(`Nota con ID ${noteId} eliminada exitosamente.`);
      } else {
        console.error(`Error al eliminar la nota con ID ${noteId}.`);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };
  
export default deleteNote