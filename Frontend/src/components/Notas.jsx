import { useEffect, useState } from 'react';

  const fetchData = async () => {
    try {
      const response = await fetch('/notes');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  export async function load() {
    const notesData = await fetchData();
    return {
      props: {
        notesData,
      },
    };
  }

  const Notas = (props) => {
    const { notesData } = props;

    return (
      <>
        <div>
          <pre>{JSON.stringify(notesData, null, 2)}</pre>
        </div>
      </>
    );
  };
  export default Notas;