import './App.css';
import { useEffect, useState } from 'react';
import Home from './pages/homepage/homepage';
import Location from './pages/location';
import Mapa from './pages/mapa/mapa';
import Final from './pages/final';
import Splashscreen from './pages/splashscreen/splashscreen';

const QUEST_ORDER = ['parque', 'prefeitura', 'escola', 'casa', 'mercado'];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [logoReveal, setLogoReveal] = useState(0);
  const [selectedCharacterId, setSelectedCharacterId] = useState('homer');
  const [completedLocationIds, setCompletedLocationIds] = useState([]);

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
    setCompletedLocationIds([]);
    setCurrentPage('mapa');
  };

  const handleCompleteLocation = (locationId) => {
    setCompletedLocationIds((currentCompletedLocationIds) => {
      if (currentCompletedLocationIds.includes(locationId)) {
        return currentCompletedLocationIds;
      }

      const nextLocationId = QUEST_ORDER[currentCompletedLocationIds.length];

      if (locationId !== nextLocationId) {
        return currentCompletedLocationIds;
      }

      return [...currentCompletedLocationIds, locationId];
    });

    setCurrentPage('mapa');
  };

  const renderPage = () => {
    const nextUnlockedLocationId = QUEST_ORDER[completedLocationIds.length] || null;
    const unlockedLocationIds = new Set([
      ...completedLocationIds,
      ...(nextUnlockedLocationId ? [nextUnlockedLocationId] : []),
    ]);

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
      case 'escola':
      case 'mercado':
      case 'casa':
      case 'parque':
      case 'prefeitura':
        return (
          <Location
            locationId={currentPage}
            isCompleted={completedLocationIds.includes(currentPage)}
            isUnlocked={unlockedLocationIds.has(currentPage)}
            nextUnlockedLocationId={nextUnlockedLocationId}
            onCompleteLocation={handleCompleteLocation}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'mapa':
        return (
          <Mapa
            completedLocationIds={completedLocationIds}
            nextUnlockedLocationId={nextUnlockedLocationId}
            setCurrentPage={setCurrentPage}
          />
        );
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
