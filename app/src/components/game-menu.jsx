import { useState } from 'react';
import { Map, Pause, Play, RotateCcw } from 'lucide-react';
import './game-menu.css';

export default function GameMenu({ currentPage, onGoMap, onRestart }) {
  const [isOpen, setIsOpen] = useState(false);
  const canGoMap = currentPage !== 'home' && currentPage !== 'mapa';

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleGoMap = () => {
    onGoMap?.();
    closeMenu();
  };

  const handleRestart = () => {
    onRestart?.();
    closeMenu();
  };

  return (
    <>
      <button
        type="button"
        className="game-menu-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Pausar jogo"
        title="Pausar jogo"
      >
        <Pause aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="game-menu-backdrop" role="dialog" aria-modal="true" aria-label="Menu de pausa">
          <section className="game-menu-panel">
            <p className="game-menu-kicker">Jogo pausado</p>
            <h2>SpringVille Quest</h2>

            <div className="game-menu-actions">
              <button type="button" className="game-menu-action" onClick={closeMenu}>
                <Play aria-hidden="true" />
                Continuar
              </button>
              <button
                type="button"
                className="game-menu-action game-menu-action--secondary"
                onClick={handleGoMap}
                disabled={!canGoMap}
              >
                <Map aria-hidden="true" />
                Voltar ao mapa
              </button>
              <button
                type="button"
                className="game-menu-action game-menu-action--danger"
                onClick={handleRestart}
              >
                <RotateCcw aria-hidden="true" />
                Reiniciar jogo
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
