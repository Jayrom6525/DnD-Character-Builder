//gives state variables, email password ect
import {useState} from 'react';
//useNaviagte redirects to / after registration success
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    //function runs when form is submitted, async waits for API call, event is the form submission
    async function handleSubmit(event) {
    //prevents default form submission behavior, which would cause a page reload = bad for single page app
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    //check if passwords match before calling backend
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    //marks form as "busy", disables submit button to prevent multiple submissions, each submit should start clean
    setIsSubmitting(true);

    //runtime/network error handling
    try {
      const response = await fetch('http://localhost:5030/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setErrorMessage('Registration failed. Please check your email and password.');
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Account created successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch (error) {
      setErrorMessage('An error occurred while trying to register.');
    } finally {
      setIsSubmitting(false);
    }
  }
  //JSX UI so form can be used
  return (
    <div>
        <h1>Create an Account</h1>
        {errorMessage && <p style={{ color: 'red'}}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green'}}>{successMessage}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id='email'
                    type='email'
                    vlaue={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password">Password</label>
                <input
                    id='password'
                    type='password'
                    vlaue={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id='confirmPassword'
                    type='password'
                    vlaue={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                />
            </div>

            <button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
            </button>
        </form>

        <p>
            Already have an account? <Link to='/login'>Log in here</Link>.
        </p>
    </div>
  );
}

export default RegisterPage;