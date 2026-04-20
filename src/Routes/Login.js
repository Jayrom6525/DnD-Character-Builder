import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';

function LoginPage() {
    const navigate = useNavigate();
    //states go here
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    //creates a function that runs when form is submitted
    async function handleSubmit(event) {
        //stops default form submission behavior, which would cause a page reload = bad for single page apps
        event.preventDefault();
        //clears old error, success messages and marks form as "busy", each submit should start clean
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try{
            //send request to backend API 
            const response = await fetch('http://localhost:5030/auth/login', {
                method: 'POST',
                headers: {
                    //lets backend know we're sending JSON data, important for parsing request body
                    'Content-Type': 'application/json'
            },
            //include credentials (cookies) in request, important for session management and auth
            credentials: 'include',
            //builds JSON body for react state
            body: JSON.stringify({ 
                email,
                password,
                rememberMe
            }),
        });
            //backend returns failure status code
            if (!response.ok) {
                setErrorMessage('Login failed. Please check your credentials and try again.');
                return;
            }

            const data = await response.json();
            setSuccessMessage(data.message);

            //after successful login, wait a moment to show success message, then navigate to home page
            setTimeout(() => {
                navigate('/');
            }, 500);
        } catch (error) {
            setErrorMessage('An error occurred while trying to log in. Please try again later.');
            //resets form "busy" state, allows user to try again after error
        } finally {
            setIsSubmitting(false);
        }
    }
return (
<main className="home-shell">
    <section className="home-hero" aria-labelledby="login-title">
        <div className="hero-copy">
        <p className="eyebrow">Account Access</p>
        <h1 id="login-title">Welcome back, adventurer.</h1>
        <p className="hero-description"> Sign in to save characters, manage builds, and continue your campaign.</p>
            
            {/* displays error messageif failed loggin, or display success message */}
            {errorMessage && (
                <p style={{ color: '#ff8a8a', marginBottom: '1rem' }}>
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p style={{ color: '#9be7a1', marginBottom: '1rem' }}>
                    {successMessage}
                </p>
            )}

            <form onSubmit={handleSubmit} className="card-controls" style={{ flexWrap: 'wrap' }}>
                <input 
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    type="password" 
                    placeholder="Password" 
                    aria-label="Password" 
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    Remember Me
                </label>
                <button type="submit" className="primary-cta" disabled={isSubmitting}>
                    {/*disables button while login request is running, provides feed back the submission is working*/}
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <Link to="/" className="primary-cta" style={{ marginTop: '1rem', textDecoration: 'none' }}>Back to Home</Link>
        </div>
    </section>
</main>
);
}

export default LoginPage;