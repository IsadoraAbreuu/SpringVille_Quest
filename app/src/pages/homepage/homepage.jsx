import './homepage.css';
import { useEffect, useState } from 'react';
import logoSpringville from '../../assets/images/logo-springville.svg';
import CharacterCarousel from '../../components/character-carrossel';
import GameIntro from '../../components/game-intro';

export default function Home({
	logoReveal = 1,
	selectedCharacterId,
	onSelectCharacter,
	onStartGame,
}) {
  const [isLogoLockedVisible, setIsLogoLockedVisible] = useState(false);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isSceneDropping, setIsSceneDropping] = useState(false);
  const clampedLogoReveal = Math.min(Math.max(logoReveal, 0), 1);

  useEffect(() => {
    if (clampedLogoReveal >= 0.98) {
      setIsLogoLockedVisible(true);
    }
  }, [clampedLogoReveal]);

  useEffect(() => {
    if (!isSceneDropping) {
      return undefined;
    }

    const transitionTimer = window.setTimeout(() => {
      setHasSeenIntro(true);
    }, 860);

    return () => {
      window.clearTimeout(transitionTimer);
    };
  }, [isSceneDropping]);

  const resolvedLogoReveal = isLogoLockedVisible ? 1 : clampedLogoReveal;
  const isIntroVisible = resolvedLogoReveal >= 0.72 || isLogoLockedVisible;
  const isGameIntroVisible = isIntroVisible && !isSceneDropping;
  const isCarouselVisible = isIntroVisible && hasSeenIntro;
  const isSceneAtBottom = isSceneDropping || hasSeenIntro;

  const handlePlay = (characterId) => {
		onStartGame?.(characterId);
	};

	const handleIntroFinish = () => {
		setIsSceneDropping(true);
	};

  return (
    <main className={`homepage${isSceneAtBottom ? ' homepage--scene-bottom' : ''}`}>
      <div aria-hidden="true" className="homepage__background" />
      <div className="homepage__overlay" />
		<div className="homepage__content">
			<header className={`homepage__header${isSceneAtBottom ? ' homepage__header--compact' : ''}`}>
        <img
          src={logoSpringville}
          alt="SpringVille"
          className={`homepage__logo${resolvedLogoReveal > 0 ? ' homepage__logo--visible' : ''}${isSceneAtBottom ? ' homepage__logo--compact' : ''}`}
        />
			</header>

      {!hasSeenIntro && (
        <GameIntro
          isVisible={isGameIntroVisible}
          onFinish={handleIntroFinish}
        />
      )}

			<CharacterCarousel
				activeCharacterId={selectedCharacterId}
				onCharacterChange={onSelectCharacter}
				onPlay={handlePlay}
				isVisible={isCarouselVisible}
			/>
		</div>
    </main>
  );
}
