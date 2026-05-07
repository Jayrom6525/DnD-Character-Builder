import { useState, useEffect } from 'react';

function Profile() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
          // Hit backend directly so this route is never treated as a React page path.
          const response = await fetch('http://localhost:5030/characters/mine', {
                    credentials: 'include'
                });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('You must be logged in to view your characters.');
            }

            throw new Error('Failed to fetch characters');
          }

          const contentType = response.headers.get('content-type') || '';
          if (!contentType.includes('application/json')) {
            throw new Error('The server returned a non-JSON response.');
          }

                const data = await response.json();
          setCharacters(Array.isArray(data) ? data : []);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCharacters();
    }, []);

      async function handleDelete(characterId) {
        setErrorMessage('');
        const confirmed = window.confirm('Delete this character? This cannot be undone.');
        if (!confirmed) {
          return;
        }

        try {
          setDeletingId(characterId);

          const response = await fetch(`http://localhost:5030/characters/${characterId}`, {
            method: 'DELETE',
            credentials: 'include'
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('You must be logged in to delete characters.');
            }

            if (response.status === 404) {
              throw new Error('Character not found.');
            }

            throw new Error('Failed to delete character.');
          }

          setCharacters((current) => current.filter((c) => c.id !== characterId));
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setDeletingId(null);
        }
      }

    return (
      <main>
      <h1>My Characters</h1>

      {isLoading && (
        <p>Loading your characters...</p>
      )}

      {errorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {!isLoading && characters.length === 0 && (
        <p>No characters yet. <a href="/create-character">Create one!</a></p> 
      )}

      {characters.length > 0 && (
        <div> {/*container for characters */}
          {characters.map((character) => (
            <div key={character.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h2>{character.name}</h2>
              <p><strong>Class:</strong> {character.class}</p>
              <p><strong>Race:</strong> {character.race}</p>
              <p><strong>Level:</strong> {character.level}</p>
              <small>Created: {new Date(character.createdAtUtc ?? character.CreatedAtUtc).toLocaleDateString()}</small>
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => handleDelete(character.id)}
                  disabled={deletingId === character.id}
                >
                  {deletingId === character.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </main>
      );
}

export default Profile;