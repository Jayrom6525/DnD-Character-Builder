import { useState, useEffect } from 'react';

function Profile() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [editingId, setEditingId] = useState(null); //stores which character is being edited, allows edit mode
    const [isSavingEdit, setIsSavingEdit] = useState(false); //tracks if update request is in progress, disables save button while editing
    const [editForm, setEditForm] = useState({//temp form values while editing character hold input values
      name: '', // editable character name field
      characterClass: '', // editable character class field (maps to backend CharacterClass)
      race: '', // editable character race field
      level: 1 // editable character level field with default 1
    });

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

    function startEdit(character) { //called when user clicks edit
      setErrorMessage(''); //clear old errors
      setEditingId(character.id) //marks this character row as being edited
      setEditForm({ //pre-fill form with existing character values
        name: character.name ?? '',
        characterClass: character.class ?? '',
        race: character.race ?? '',
        Level: Number(character.level ?? 1)
        //existing values, defaults to empty or level 1 if missing
      });
    }
    
    function cancelEdit() { //called when user clicks cancel during editing
      setEditingId(null); //exit edit mode
      setIsSavingEdit(false); //reset saving state in case it was set
      setEditForm({
        name: '',
        characterClass: '',
        race: '',
        level: 1
      });  
    }

    function handleEditChange(event) {
      const { name, value } = event.target;
      setEditForm((current) => ({ //update edit form state on prev values
        ...current, //keep unchanged fields
        [name]: name === 'level' ? Number(value) : value //convert level to number
      }));
    }

    async function saveEdit(characterId) { //async, it waits for PUT request to finish
      setErrorMessage('');

      // frontend validation: check required fields before sending request
      if (!editForm.name.trim() || !editForm.characterClass.trim() || !editForm.race.trim()) {
        setErrorMessage('Name, class, and race are required');
        return;
      }

      //validate level is a real number allowed in range
      if (Number.isNaN(editForm.level) || editForm.level < 1 || editForm.level > 20) {
        setErrorMessage('Level must be a number between 1 and 20');
        return;
      }

      try {
        setIsSavingEdit(true); // disable save button while request runs

        const response = await fetch(`http://localhost:5030/characters/${characterId}`, {
          method: 'PUT', //tells backend this is an update
          headers: {
            'Content-Type': 'application/json' //send JSON body
          },
          credentials: 'include', //sends cookies for auth
          body: JSON.stringify({ // converts form to JSON string 
            name: editForm.name, //update name
            characterClass: editForm.characterClass, //update class
            race: editForm.race, //update race
            level: editForm.level // update level
          })
        });

         if (!response.ok) { // if backend returns any non-success status
        if (response.status === 401) {
          throw new Error('You must be logged in to update characters.'); // handle session expired
        }
        if (response.status === 404) {
          throw new Error('Character not found.'); // handle missing character
        }
        throw new Error('Failed to update character.'); // fallback for any other error
      }

      const updated = await response.json(); // read updated character data sent back from backend

      setCharacters((current) => // update local characters list without refetching from server
        current.map((character) => { // loop through all characters
          if (character.id !== characterId) return character; // leave other characters unchanged
          return { // replace this character with updated values from backend response
            ...character, // keep any fields not returned by backend
            name: updated.name ?? character.name,
            class: updated.class ?? character.class,
            race: updated.race ?? character.race,
            level: updated.level ?? character.level,
            createdAtUtc: updated.createdAtUtc ?? character.createdAtUtc
          };
        })
      );

      cancelEdit(); // exit edit mode and reset form after successful save
    } catch (error) {
      setErrorMessage(error.message); // display error message to user
    } finally {
      setIsSavingEdit(false); // always re-enable save button at end, success or failure
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