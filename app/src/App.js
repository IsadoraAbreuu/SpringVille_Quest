import './App.css';
import { useEffect, useState } from 'react';
import Home from './pages/homepage/homepage';
import Location from './pages/location';
import Mapa from './pages/mapa';
import Final from './pages/final';
import Splashscreen from './pages/splashscreen';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [logoReveal, setLogoReveal] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime;

    const loadingTimer = window.setTimeout(() => {
      setIsSplashExiting(true);

      const animateReveal = (timestamp) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / 1600, 1);

        setLogoReveal(progress);

        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(animateReveal);
          return;
        }

        setShowSplash(false);
      };

      animationFrameId = window.requestAnimationFrame(animateReveal);
    }, 1800);

    return () => {
      window.clearTimeout(loadingTimer);
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home logoReveal={logoReveal} />;
      case 'location':
        return <Location setCurrentPage={setCurrentPage} />;
      case 'mapa':
        return <Mapa setCurrentPage={setCurrentPage} />;
      case 'final':
        return <Final setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      {showSplash && <Splashscreen isExiting={isSplashExiting} />}
    </div>
  );
}

export default App;
