import './App.css';
import { useEffect, useState } from 'react';
import Home from './pages/homepage/homepage';
import Location from './pages/location';
import Mapa from './pages/mapa';
import Final from './pages/final';
import Splashscreen from './pages/splashscreen/splashscreen';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [logoReveal, setLogoReveal] = useState(0);
  const [selectedCharacterId, setSelectedCharacterId] = useState('homer');

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => {
      setIsSplashExiting(true);
    }, 1650);

    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, []);

  const handleSplashRevealProgress = (progress) => {
    setLogoReveal(progress);
  };

  const handleSplashComplete = () => {
    setLogoReveal(1);
    setShowSplash(false);
  };

  const handleCharacterSelection = (characterId) => {
    setSelectedCharacterId(characterId);
  };

  const handleStartGame = (characterId) => {
    setSelectedCharacterId(characterId);
    setCurrentPage('location');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
        <Home
          logoReveal={logoReveal}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={handleCharacterSelection}
          onStartGame={handleStartGame}
        />
      );
      case 'location':
        return <Location setCurrentPage={setCurrentPage} />;
      case 'mapa':
        return <Mapa setCurrentPage={setCurrentPage} />;
      case 'final':
        return <Final setCurrentPage={setCurrentPage} />;
      default:
      return (
        <Home
          logoReveal={logoReveal}
          selectedCharacterId={selectedCharacterId}
          onSelectCharacter={handleCharacterSelection}
          onStartGame={handleStartGame}
        />
      );
    }
  };

  return (
    <div className="App">
      {renderPage()}
      {showSplash && (
        <Splashscreen
          isExiting={isSplashExiting}
          onRevealProgress={handleSplashRevealProgress}
          onExitComplete={handleSplashComplete}
        />
      )}
    </div>
  );
}

export default App;
