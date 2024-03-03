export async function postNote(noteData) {
    const response = await fetch('https://wondernotes.onrender.com/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
  
    return response;
  }
  