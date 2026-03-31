import { Link } from 'react-router-dom';
import '../App.css';

function LoginPage() {
return (
<main className="home-shell">
    <section className="home-hero" aria-labelledby="login-title">
        <div className="hero-copy">
        <p className="eyebrow">Account Access</p>
        <h1 id="login-title">Welcome back, adventurer.</h1>
        <p className="hero-description"> Sign in to save characters, manage builds, and continue your campaign.</p>
            <form className="card-controls" style={{ flexWrap: 'wrap' }}>
                <input type="email" placeholder="Email" aria-label="Email" />
                <input type="password" placeholder="Password" aria-label="Password" />
                <button type="submit" className="primary-cta">Sign In</button>
            </form>
            <Link to="/" className="primary-cta" style={{ marginTop: '1rem', textDecoration: 'none' }}>Back to Home</Link>
        </div>
    </section>
</main>
);
}

export default LoginPage;