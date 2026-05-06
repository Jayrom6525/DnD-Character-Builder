import { useState } from "react"; // react hook for local component state

function CreateCharacter() { //page component for creating character 
    const [name, setName] = useState(""); //stores component for create a character
    const [characterClass, setCharacterClass] = useState(""); //stores class input
    const [race, setRace] = useState(""); //stores race input
    const [level, setLevel] = useState(1); //stores level input with default value of 1

    const [isSubmitting, setIsSubmitting] = useState(false); // Tracks whether form is currently submitting
    const [errorMessage, setErrorMessage] = useState(''); // Stores any error message to show user
    const [successMessage, setSuccessMessage] = useState(''); // Stores success message after save

  async function handleSubmit(event) { // Runs when form is submitted
    event.preventDefault(); // Stops browser from reloading page

    setErrorMessage(''); // Clear old errors before new submit
    setSuccessMessage(''); // Clear old success message before new submit
    setIsSubmitting(true); // Mark form as busy while request is happening

    try {
      const response = await fetch('http://localhost:5030/characters', { // Send POST request to backend
        method: 'POST', // We are creating a new record
        headers: {
          'Content-Type': 'application/json', // Tell backend request body is JSON
        },
        credentials: 'include', // Include auth cookie so backend knows who user is
        body: JSON.stringify({
          name, // Send name state
          characterClass, // Send class state
          race, // Send race state
          level, // Send level state
        }),
      });

      if (!response.ok) { // If backend returns non-success status
        setErrorMessage('Could not save character.'); // Show basic error message
        return; // Stop here, do not continue to success
      }

      const data = await response.json(); // Read JSON response from backend
      setSuccessMessage(`Character ${data.name} created successfully!`); // Show success message

      setName(''); // Reset name field after success
      setCharacterClass(''); // Reset class field after success
      setRace(''); // Reset race field after success
      setLevel(1); // Reset level back to default
    } catch (error) {
      setErrorMessage('Something went wrong while saving your character.'); // Handle network/server failure
    } finally {
      setIsSubmitting(false); // Always turn off loading state at the end
    }
  }


    return ( //JSX return to render page
        <main>
            <h1>Create Caracter</h1>

            <form onSubmit={handleSubmit}> {/* form element with submit handler */}
                <div> {/* form group for character name input */ }
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)} //updates name state on input change
                    />
                </div>

                <div>{/* form group for character class input */ }
                    <label htmlFor="characterClass">Class</label>
                    <input
                        id="characterClass"
                        type="text"
                        value={characterClass}
                        onChange={(event) => setCharacterClass(event.target.value)}
                    />
                </div>

                <div>{/* form group for characterRace input */ }
                    <label htmlFor="race">Race</label>
                    <input
                        id="race"
                        type="text"
                        value={race}
                        onChange={(event) => setRace(event.target.value)}
                    />
                </div>

                <div>{/* form group for Level input */ }
                    <label htmlFor="level">Level</label>
                    <input
                        id="level"
                        type="number"
                        min="1"
                        max="20"
                        value={level}
                        onChange={(event) => setLevel(Number(event.target.value))}
                    />
                </div>

            </form>
        </main>
    );
}

export default CreateCharacter;