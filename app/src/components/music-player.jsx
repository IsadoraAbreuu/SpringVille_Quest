import { useEffect, useRef, useState } from 'react';
import { Minus, Music, Plus, SlidersHorizontal, Volume2, VolumeX, X } from 'lucide-react';
import './music-player.css';

const VIDEO_ID = '0KHEOZnMtTI';
const DEFAULT_VOLUME = 45;
const VOLUME_STEP = 10;

export default function MusicPlayer() {
  const playerRef = useRef(null);
  const playerElementId = useRef(`springville-music-${Date.now()}`);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const createPlayer = () => {
      if (!window.YT?.Player || playerRef.current) {
        return;
      }

      playerRef.current = new window.YT.Player(playerElementId.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          loop: 1,
          modestbranding: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            event.target.setVolume(DEFAULT_VOLUME);
            event.target.playVideo();
            setIsReady(true);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);
      }

      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };
    }

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  const syncVolume = (nextVolume) => {
    playerRef.current?.setVolume?.(nextVolume);
    setVolume(nextVolume);

    if (nextVolume > 0 && isMuted) {
      playerRef.current?.unMute?.();
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) {
      return;
    }

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const changeVolume = (direction) => {
    const nextVolume = Math.min(100, Math.max(0, volume + direction * VOLUME_STEP));
    syncVolume(nextVolume);
  };

  const handleVolumeInput = (event) => {
    syncVolume(Number(event.target.value));
  };

  return (
    <div
      className={`music-player${isExpanded ? ' music-player--expanded' : ''}`}
      aria-label="Controles da musica"
    >
      <div className="music-frame" id={playerElementId.current} />

      <button
        type="button"
        className="music-btn music-btn--mute"
        onClick={toggleMute}
        aria-label={isMuted ? 'Ativar musica' : 'Mutar musica'}
        title={isMuted ? 'Ativar musica' : 'Mutar musica'}
      >
        {isMuted ? <VolumeX aria-hidden="true" /> : <Music aria-hidden="true" />}
      </button>

      <button
        type="button"
        className="music-btn music-btn--toggle"
        onClick={() => setIsExpanded((currentValue) => !currentValue)}
        aria-label={isExpanded ? 'Fechar volume' : 'Abrir volume'}
        aria-expanded={isExpanded}
        title={isExpanded ? 'Fechar volume' : 'Abrir volume'}
      >
        {isExpanded ? <X aria-hidden="true" /> : <SlidersHorizontal aria-hidden="true" />}
      </button>

      {isExpanded && (
        <div className="music-volume-panel">
          <button
            type="button"
            className="music-btn music-btn--volume"
            onClick={() => changeVolume(-1)}
            disabled={!isReady || volume <= 0}
            aria-label="Diminuir volume"
            title="Diminuir volume"
          >
            <Minus aria-hidden="true" />
          </button>

          <label className="music-volume-control">
            <span>
              <Volume2 aria-hidden="true" />
              Volume {volume}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={volume}
              onChange={handleVolumeInput}
              disabled={!isReady}
              aria-label={`Volume ${volume}%`}
              style={{ '--music-volume-fill': `${volume}%` }}
            />
          </label>

          <button
            type="button"
            className="music-btn music-btn--volume"
            onClick={() => changeVolume(1)}
            disabled={!isReady || volume >= 100}
            aria-label="Aumentar volume"
            title="Aumentar volume"
          >
            <Plus aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
