import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './App.css';


// This is a static showcase of the 12 D&D classes
const CLASS_SHOWCASE = [
  {
    name: 'Barbarian',
    tagline: 'Rage and anger makes the warrior.',
    flavor:
      'Pure brute strength and rage.',
    style: 'barbarian',
  },
  {
    name: 'Bard',
    tagline: 'Music that controlls.',
    flavor:
      'Sharp swords and even sharper words.',
    style: 'bard',
  },
  
  {
    name: 'Cleric',
    tagline: 'Divine support, resilience, and radiant power.',
    flavor:
      'Clerics channel a higher calling to heal allies, ward danger, and punish the wicked with sacred might.',
    style: 'cleric',
  },

  {
    name: 'Druid',
    tagline: 'Beastiality?',
    flavor:
      'Chanel natures essence to control the elements or become nature itself.',
    style: 'druid',
  },

  {
    name: 'Fighter',
    tagline: 'Frontline control and raw martial strength.',
    flavor:
      'Masters of weapons, armor, and battlefield tactics. Fighters adapt to any threat and hold the line when it matters most.',
    style: 'fighter',
  },

  {
    name: 'Monk',
    tagline: 'Deciplin.',
    flavor:
      'Release all earthly teathers.',
    style: 'monk',
  },

  {
    name: 'Paladin',
    tagline: 'You wield holy power to keep your oath.',
    flavor:
      'SMITE SMITE SMITE SMITE SMITE.',
    style: 'paladin',
  },

  {
    name: 'Ranger',
    tagline: 'Usele.... i mean bow + animal companion.',
    flavor:
      'Rangers favor far range combate while animal gets close.',
    style: 'ranger',
  },

  {
    name: 'Rogue',
    tagline: 'Is there anywhere to hide?',
    flavor:
      'Rogues thrive in shadows and chaos. They strike where it hurts, disable traps, and solve problems no one else can.',
    style: 'rogue',
  },

  {
    name: 'Sorcerer',
    tagline: 'Inate magical power, the 1% of magic',
    flavor:
      'Your pure latin tallent lets you bend and control the weave with ease.',
    style: 'sorcerer',
  },

  {
    name: 'Warlock',
    tagline: 'Pact magic fueled by a bargain with an otherworldly being.',
    flavor:
      'Otherwordly powers, either known or unknown.',
    style: 'warlock',
  },

  {
    name: 'Wizard',
    tagline: 'Arcane scholar with unmatched spell variety.',
    flavor:
      'Wizards bend reality through study and precision. They bring explosive power, clever utility, and game-changing control.',
    style: 'wizard',
  },

  

];

// creates an active state, counter starts at 0, showing the first class in the array
function App() {
  const [activeClass, setActiveClass] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, authChecked, logout } = useAuth();

// memoizes the current class, recomputes when activeClass changes
  const currentClass = useMemo(
    () => CLASS_SHOWCASE[activeClass],
    [activeClass]
  );

// set up an interval to change the active class every 5 seconds, and clear the interval on unmount
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveClass((previous) => (previous + 1) % CLASS_SHOWCASE.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);


// manual navigation, shows next or previous class, and wraps around the array  
  const showPrevious = () => {
    setActiveClass((previous) =>
      previous === 0 ? CLASS_SHOWCASE.length - 1 : previous - 1
    );
  };

  const showNext = () => {
    setActiveClass((previous) => (previous + 1) % CLASS_SHOWCASE.length);
  };

  async function handleLogout() {
    try {
      const response =await fetch('http://localhost:5030/auth/logout',{
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        alert('Logout failed');
        return;
      }

      logout();
      navigate('/login');
    } catch (error) {
      alert('An error occurred during logout');
    }
  }

  if (!authChecked) {
    return <div>Checking Session...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <button type="button" className="login-btn" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login" className="login-btn">Login</Link>
      )}
       
      <main className="home-shell">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">D&D Character Builder</p>
            <h1 id="hero-title">Forge your next legend.</h1>
            <p className="hero-description">
              Build heroes with confidence. Start with class identity, then we
              will layer in races, backgrounds, stats, equipment, and eventually
              live API-powered rules data.
            </p>
            <button type="button" className="primary-cta">
              Your Next Adventure is calling
            </button>
          </div>

          <article
            className={`class-card card-${currentClass.style}`}
            aria-live="polite"
          >
            <p className="card-label">Featured Class</p>
            <h2>{currentClass.name}</h2>
            <p className="card-tagline">{currentClass.tagline}</p>
            <p className="card-flavor">{currentClass.flavor}</p>

            <div className="card-controls" aria-label="Class carousel controls">
              <button type="button" onClick={showPrevious}>
                Previous
              </button>
              <button type="button" onClick={showNext}>
                Next
              </button>
            </div>

            <div className="card-dots" aria-hidden="true">
              {CLASS_SHOWCASE.map((item, index) => (
                <span
                  key={item.name}
                  className={index === activeClass ? 'dot is-active' : 'dot'}
                />
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
