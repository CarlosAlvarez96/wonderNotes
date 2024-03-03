export async function postNote(noteData) {
    const response = await fetch('http://127.0.0.1:8000/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
  
    return response;
  }
  