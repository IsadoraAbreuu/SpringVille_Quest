import './App.css';
import { useEffect, useState } from 'react';
import Home from './pages/homepage/homepage';
import GameMenu from './components/game-menu';
import MusicPlayer from './components/music-player';
import Location from './pages/location/location';
import Mapa from './pages/mapa/mapa';
import Final from './pages/final';
import Splashscreen from './pages/splashscreen/splashscreen';

const QUEST_ORDER = ['parque', 'prefeitura', 'escola', 'casa', 'mercado'];
const STORAGE_KEY = 'springville-quest-save';
const VALID_PAGES = new Set(['home', 'location', 'mapa', 'final', ...QUEST_ORDER]);
const VALID_CHARACTERS = new Set(['homer', 'marge', 'bart', 'lisa']);

function getSavedGame() {
  try {
    const savedGame = window.localStorage.getItem(STORAGE_KEY);

    if (!savedGame) {
      return {};
    }

    const parsedGame = JSON.parse(savedGame);
    const completedLocationIds = Array.isArray(parsedGame.completedLocationIds)
      ? parsedGame.completedLocationIds.filter((locationId) => QUEST_ORDER.includes(locationId))
      : [];

    return {
      currentPage: VALID_PAGES.has(parsedGame.currentPage) ? parsedGame.currentPage : 'home',
      selectedCharacterId: VALID_CHARACTERS.has(parsedGame.selectedCharacterId) ? parsedGame.selectedCharacterId : 'homer',
      completedLocationIds,
      hasSeenMapIntro: Boolean(parsedGame.hasSeenMapIntro),
      totalCoins: Number.isFinite(parsedGame.totalCoins) ? parsedGame.totalCoins : 0,
    };
  } catch {
    return {};
  }
}

function App() {
  const [savedGame] = useState(getSavedGame);
  const [currentPage, setCurrentPage] = useState(savedGame.currentPage || 'home');
  const [showSplash, setShowSplash] = useState(true);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [splashReplayId, setSplashReplayId] = useState(0);
  const [logoReveal, setLogoReveal] = useState(0);
  const [selectedCharacterId, setSelectedCharacterId] = useState(savedGame.selectedCharacterId || 'homer');
  const [completedLocationIds, setCompletedLocationIds] = useState(savedGame.completedLocationIds || []);
  const [recentColoredLocationId, setRecentColoredLocationId] = useState(null);
  const [hasSeenMapIntro, setHasSeenMapIntro] = useState(savedGame.hasSeenMapIntro || false);
  const [totalCoins, setTotalCoins] = useState(savedGame.totalCoins || 0);

  useEffect(() => {
    if (!showSplash) {
      return undefined;
    }

    const loadingTimer = window.setTimeout(() => {
      setIsSplashExiting(true);
    }, 1650);

    return () => {
      window.clearTimeout(loadingTimer);
    };
  }, [showSplash, splashReplayId]);

  useEffect(() => {
    const gameToSave = {
      currentPage,
      selectedCharacterId,
      completedLocationIds,
      hasSeenMapIntro,
      totalCoins,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameToSave));
  }, [completedLocationIds, currentPage, hasSeenMapIntro, selectedCharacterId, totalCoins]);

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
    setRecentColoredLocationId(null);
    setHasSeenMapIntro(false);
    setTotalCoins(0);
    setCurrentPage('mapa');
  };

  const handleRestartGame = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setCurrentPage('home');
    setSelectedCharacterId('homer');
    setCompletedLocationIds([]);
    setRecentColoredLocationId(null);
    setHasSeenMapIntro(false);
    setTotalCoins(0);
    setLogoReveal(0);
    setIsSplashExiting(false);
    setShowSplash(true);
    setSplashReplayId((currentReplayId) => currentReplayId + 1);
  };

  const handleEarnCoins = (amount) => {
    setTotalCoins((currentTotalCoins) => currentTotalCoins + amount);
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

      const nextCompletedLocationIds = [...currentCompletedLocationIds, locationId];

      if (nextCompletedLocationIds.length === QUEST_ORDER.length) {
        setCurrentPage('final');
      } else {
        setRecentColoredLocationId(locationId);
        setCurrentPage('mapa');
      }

      return nextCompletedLocationIds;
    });
  };

  const handleRevealAnimationComplete = () => {
    setRecentColoredLocationId(null);
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
        return (
          <Location
            selectedCharacterId={selectedCharacterId}
            totalCoins={totalCoins}
            onEarnCoins={handleEarnCoins}
            setCurrentPage={setCurrentPage}
          />
        );
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
            selectedCharacterId={selectedCharacterId}
            totalCoins={totalCoins}
            onEarnCoins={handleEarnCoins}
            onCompleteLocation={handleCompleteLocation}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'mapa':
        return (
          <Mapa
            completedLocationIds={completedLocationIds}
            nextUnlockedLocationId={nextUnlockedLocationId}
            revealLocationId={recentColoredLocationId}
            selectedCharacterId={selectedCharacterId}
            showMapIntro={!hasSeenMapIntro}
            totalCoins={totalCoins}
            onRevealAnimationComplete={handleRevealAnimationComplete}
            onMapIntroComplete={() => setHasSeenMapIntro(true)}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'final':
        return <Final totalCoins={totalCoins} onRestart={handleRestartGame} />;
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
      {!showSplash && (
        <GameMenu
          currentPage={currentPage}
          onGoMap={() => setCurrentPage('mapa')}
          onRestart={handleRestartGame}
        />
      )}
      {!showSplash && <MusicPlayer />}
      {showSplash && (
        <Splashscreen
          key={splashReplayId}
          isExiting={isSplashExiting}
          onRevealProgress={handleSplashRevealProgress}
          onExitComplete={handleSplashComplete}
        />
      )}
    </div>
  );
}

export default App;
