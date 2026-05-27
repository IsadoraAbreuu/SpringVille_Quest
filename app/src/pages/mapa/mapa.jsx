import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import {
  Check,
  Lock,
  MapPinned,
  Minus,
  PackageOpen,
  Play,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import mapaColorido from "../../assets/images/mapa/mapa.svg";
import mapaGray from "../../assets/images/mapa/mapa-gray.svg";
import casaStage from "../../assets/images/mapa/casa.svg";
import escolaStage from "../../assets/images/mapa/escola.svg";
import parqueStage from "../../assets/images/mapa/parque.svg";
import prefeituraStage from "../../assets/images/mapa/prefeitura.svg";
import casaBackground from "../../assets/images/locais/casa.jpg";
import escolaBackground from "../../assets/images/locais/escola.jpg";
import mercadoBackground from "../../assets/images/locais/mercado.jpg";
import parqueBackground from "../../assets/images/locais/parque.jpg";
import prefeituraBackground from "../../assets/images/locais/prefeitura.jpg";
import bartGuide from "../../assets/images/personagens/bart.svg";
import bartGuideActive from "../../assets/images/personagens/bart2.svg";
import homerGuide from "../../assets/images/personagens/homer.svg";
import homerGuideActive from "../../assets/images/personagens/homer2.svg";
import lisaGuide from "../../assets/images/personagens/liza.svg";
import lisaGuideActive from "../../assets/images/personagens/liza2.svg";
import margeGuide from "../../assets/images/personagens/marge.svg";
import margeGuideActive from "../../assets/images/personagens/marge2.svg";
import "./mapa.css";

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.55;
const ZOOM_STEP = 0.2;
const REVEAL_ZOOM = 1.36;

const POINTS = [
  { id: "escola", label: "Escola", x: 38, y: 28 },
  { id: "mercado", label: "Mercado", x: 61, y: 38 },
  { id: "casa", label: "Casa", x: 46, y: 50 },
  { id: "parque", label: "Parque", x: 48, y: 80 },
  { id: "prefeitura", label: "Prefeitura", x: 67, y: 9 },
];

const QUEST_ORDER = ["parque", "prefeitura", "escola", "casa", "mercado"];

const MAP_INTRO_STEPS = [
  "Ei! Olha so... SpringVille esta triste, baguncada e quase sem cor.",
  "Cada ponto do mapa guarda um desafio. Se voce resolver, aquela parte da cidade volta a brilhar.",
  "Eu vou ficar por aqui no mapa. Explore os lugares liberados e ajude SpringVille a ficar viva de novo!",
];

const GUIDE_CHARACTERS = {
  bart: { name: "Bart", image: bartGuide, activeImage: bartGuideActive },
  homer: { name: "Homer", image: homerGuide, activeImage: homerGuideActive },
  lisa: { name: "Lisa", image: lisaGuide, activeImage: lisaGuideActive },
  marge: { name: "Marge", image: margeGuide, activeImage: margeGuideActive },
};

const LOCATION_INFO = {
  parque: {
    title: "Parque",
    reward: 20,
    background: parqueBackground,
    description: "A primeira area da rota. Um espaco aberto para aquecer a memoria e encontrar a primeira pista.",
    info: "Complete um quiz e uma ordem de piquenique para restaurar esta parte da cidade.",
  },
  prefeitura: {
    title: "Prefeitura",
    reward: 24,
    background: prefeituraBackground,
    description: "O centro das decisoes de SpringVille, cheio de registros, carimbos e caminhos oficiais.",
    info: "A task mistura pergunta sobre personagens e organizacao de documentos.",
  },
  escola: {
    title: "Escola",
    reward: 28,
    background: escolaBackground,
    description: "Um ponto importante para testar conhecimento antes que o sinal toque.",
    info: "Aqui voce responde sobre musica e organiza a rotina antes da aula.",
  },
  casa: {
    title: "Casa",
    reward: 32,
    background: casaBackground,
    description: "O lar guarda pistas simples, mas importantes, para chegar na reta final.",
    info: "Resolva a pergunta sobre o doce favorito e arrume a sala na ordem certa.",
  },
  mercado: {
    title: "Mercado",
    reward: 36,
    background: mercadoBackground,
    description: "A ultima parada antes de ver a cidade completa novamente.",
    info: "Finalize respondendo sobre o mercado e organizando a compra final.",
  },
};

const MAP_STAGE_OVERLAYS = {
  parque: parqueStage,
  prefeitura: prefeituraStage,
  escola: escolaStage,
  casa: casaStage,
};

export default function Mapa({
  completedLocationIds = [],
  nextUnlockedLocationId,
  revealLocationId,
  selectedCharacterId = "homer",
  showMapIntro = false,
  totalCoins = 0,
  onRevealAnimationComplete,
  onMapIntroComplete,
  setCurrentPage,
}) {
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [zoom, setZoom] = useState(1);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [selectedInventoryId, setSelectedInventoryId] = useState(nextUnlockedLocationId || QUEST_ORDER[0]);
  const [enteringLocationId, setEnteringLocationId] = useState(null);
  const [activeRevealId, setActiveRevealId] = useState(null);
  const [mapIntroStepIndex, setMapIntroStepIndex] = useState(0);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    const updateDragArea = () => {
      if (!viewportRef.current || !worldRef.current) {
        return;
      }

      const viewport = viewportRef.current.getBoundingClientRect();
      const worldWidth = worldRef.current.offsetWidth * zoom;
      const worldHeight = worldRef.current.offsetHeight * zoom;
      const left = Math.min(0, viewport.width - worldWidth);
      const top = Math.min(0, viewport.height - worldHeight);
      const revealedPoint = activeRevealId
        ? POINTS.find((point) => point.id === activeRevealId)
        : null;

      setDragConstraints({
        left,
        right: 0,
        top,
        bottom: 0,
      });

      if (revealedPoint) {
        const targetX = viewport.width / 2 - worldWidth * (revealedPoint.x / 100);
        const targetY = viewport.height / 2 - worldHeight * (revealedPoint.y / 100);

        x.set(Math.min(0, Math.max(left, targetX)));
        y.set(Math.min(0, Math.max(top, targetY)));
      } else {
        x.set(left / 2);
        y.set(top / 2);
      }
    };

    updateDragArea();
    window.addEventListener("resize", updateDragArea);

    return () => {
      window.removeEventListener("resize", updateDragArea);
    };
  }, [activeRevealId, x, y, zoom]);

  useEffect(() => {
    if (!revealLocationId) {
      return undefined;
    }

    setActiveRevealId(revealLocationId);
    setZoom(REVEAL_ZOOM);

    const revealTimer = window.setTimeout(() => {
      setActiveRevealId(null);
      setZoom(1);
      onRevealAnimationComplete?.();
    }, 1900);

    return () => {
      window.clearTimeout(revealTimer);
    };
  }, [onRevealAnimationComplete, revealLocationId]);

  const changeZoom = (direction) => {
    setZoom((currentZoom) => {
      const nextZoom = currentZoom + direction * ZOOM_STEP;
      return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(nextZoom.toFixed(2))));
    });
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const hasCompletedQuest = completedLocationIds.includes("mercado");
  const lastCompletedLocationId = completedLocationIds[completedLocationIds.length - 1];
  const grayOverlay = hasCompletedQuest
    ? null
    : MAP_STAGE_OVERLAYS[lastCompletedLocationId] || mapaGray;
  const unlockedLocationIds = new Set([
    ...completedLocationIds,
    ...(nextUnlockedLocationId ? [nextUnlockedLocationId] : []),
  ]);
  const selectedLocationInfo = LOCATION_INFO[selectedInventoryId];
  const guideCharacter = GUIDE_CHARACTERS[selectedCharacterId] || GUIDE_CHARACTERS.homer;
  const currentIntroText = MAP_INTRO_STEPS[mapIntroStepIndex];
  const isLastMapIntroStep = mapIntroStepIndex === MAP_INTRO_STEPS.length - 1;

  useEffect(() => {
    if (showMapIntro) {
      setMapIntroStepIndex(0);
    }
  }, [showMapIntro]);

  const openInventory = () => {
    setSelectedInventoryId(nextUnlockedLocationId || completedLocationIds[completedLocationIds.length - 1] || QUEST_ORDER[0]);
    setIsInventoryOpen(true);
  };

  const startLocationEntry = (locationId) => {
    if (!unlockedLocationIds.has(locationId) || enteringLocationId) {
      return;
    }

    setIsInventoryOpen(false);
    setEnteringLocationId(locationId);
    window.setTimeout(() => {
      setCurrentPage(locationId);
    }, 880);
  };

  const enterSelectedLocation = () => {
    if (unlockedLocationIds.has(selectedInventoryId)) {
      startLocationEntry(selectedInventoryId);
    }
  };

  const advanceMapIntro = () => {
    if (isLastMapIntroStep) {
      onMapIntroComplete?.();
      return;
    }

    setMapIntroStepIndex((currentIndex) => currentIndex + 1);
  };

  return (
    <div className={`mapa-viewport${showMapIntro ? " mapa-viewport--intro" : ""}`} ref={viewportRef}>
      <motion.div
        ref={worldRef}
        className="mapa-world"
        drag={!showMapIntro}
        dragConstraints={dragConstraints}
        dragElastic={0.04}
        dragMomentum={false}
        style={{ x, y, scale: zoom }}
        whileTap={{ cursor: "grabbing" }}
      >
        <img
          className="map-layer map-color-layer"
          src={mapaColorido}
          alt="Mapa colorido de SpringVille"
          draggable="false"
        />

        {grayOverlay && (
          <img
            key={grayOverlay}
            className="map-layer map-gray-layer"
            src={grayOverlay}
            alt="Mapa de SpringVille apagado"
            draggable="false"
          />
        )}

        {POINTS.map((point) => {
          const isCompleted = completedLocationIds.includes(point.id);
          const isUnlocked = unlockedLocationIds.has(point.id);
          const isRevealing = activeRevealId === point.id;
          const statusLabel = isCompleted
            ? "Concluido"
            : isUnlocked
              ? "Liberado"
              : "Bloqueado";

          return (
            <button
              key={point.id}
              className={`map-pin${isCompleted ? " map-pin--completed" : ""}${!isUnlocked ? " map-pin--locked" : ""}${isRevealing ? " map-pin--revealing" : ""}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => {
                if (isUnlocked) {
                  startLocationEntry(point.id);
                }
              }}
              aria-disabled={!isUnlocked}
              aria-label={`${point.label} - ${statusLabel}`}
            >
              {isCompleted ? (
                <Check aria-hidden="true" />
              ) : isUnlocked ? (
                <MapPinned aria-hidden="true" />
              ) : (
                <Lock aria-hidden="true" />
              )}
              <span className="map-pin-tooltip" role="tooltip">
                <strong>{LOCATION_INFO[point.id].title}</strong>
                {isUnlocked ? (
                  <>
                    <span>{LOCATION_INFO[point.id].info}</span>
                    <em>{LOCATION_INFO[point.id].reward} moedas - clique para jogar</em>
                  </>
                ) : (
                  <>
                    <span>Este local ainda esta bloqueado.</span>
                    <em>Complete o local liberado para avancar.</em>
                  </>
                )}
              </span>
            </button>
          );
        })}

        {activeRevealId && (
          <div
            className="map-color-reveal-marker"
            style={{
              left: `${POINTS.find((point) => point.id === activeRevealId)?.x || 50}%`,
              top: `${POINTS.find((point) => point.id === activeRevealId)?.y || 50}%`,
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>

      <div className="map-progress-panel">
        <span className="map-progress-title">Restaurar a cidade</span>
        <span className="map-progress-count">
          {completedLocationIds.length} / {QUEST_ORDER.length} areas coloridas
        </span>
      </div>

      <aside
        className={`map-guide${showMapIntro ? " map-guide--talking" : ""}${enteringLocationId ? " map-guide--leaving" : ""}`}
        aria-live={showMapIntro ? "polite" : "off"}
      >
        {showMapIntro && (
          <div className="map-guide__bubble">
            <span>{guideCharacter.name}</span>
            <p>{currentIntroText}</p>
            <button type="button" onClick={advanceMapIntro}>
              {isLastMapIntroStep ? "Comecar" : "Continuar"}
            </button>
          </div>
        )}

        <div className="map-guide__crop" aria-hidden="true">
          <img src={guideCharacter.image} alt="" className="map-guide__image map-guide__image--idle" />
          <img src={guideCharacter.activeImage} alt="" className="map-guide__image map-guide__image--active" />
        </div>
      </aside>

      <div className="map-wallet" aria-label="Total de moedas">
        <span>Moedas</span>
        <strong>{totalCoins}</strong>
        <div className="map-wallet-tooltip" role="tooltip">
          Essas sao suas moedas acumuladas nos quizzes. O Homer aprovaria esse cofrinho!
        </div>
      </div>

      <button
        type="button"
        className="map-inventory-button"
        onClick={openInventory}
        aria-label="Abrir inventario de locais"
        title="Abrir inventario de locais"
      >
        <PackageOpen aria-hidden="true" />
      </button>

      <div className="map-zoom-controls" aria-label="Controles de zoom do mapa">
        <button
          type="button"
          className="map-zoom-btn"
          onClick={() => changeZoom(1)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Aumentar zoom"
          title="Aumentar zoom"
        >
          <Plus aria-hidden="true" />
        </button>
        <button
          type="button"
          className="map-zoom-btn map-zoom-btn--small"
          onClick={resetZoom}
          aria-label="Restaurar zoom"
          title="Restaurar zoom"
        >
          <RotateCcw aria-hidden="true" />
          <span>{Math.round(zoom * 100)}%</span>
        </button>
        <button
          type="button"
          className="map-zoom-btn"
          onClick={() => changeZoom(-1)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Diminuir zoom"
          title="Diminuir zoom"
        >
          <Minus aria-hidden="true" />
        </button>
      </div>

      {isInventoryOpen && (
        <div className="map-inventory-backdrop" role="dialog" aria-modal="true" aria-label="Inventario de locais">
          <section className="map-inventory-panel">
            <header className="map-inventory-header">
              <div>
                <p>Inventario</p>
                <h2>Rota de SpringVille</h2>
              </div>
              <button
                type="button"
                className="map-inventory-close"
                onClick={() => setIsInventoryOpen(false)}
                aria-label="Fechar inventario"
              >
                <X aria-hidden="true" />
              </button>
            </header>

            <div className="map-inventory-body">
              <div className="map-location-grid">
                {QUEST_ORDER.map((locationId, index) => {
                  const location = LOCATION_INFO[locationId];
                  const isUnlocked = unlockedLocationIds.has(locationId);
                  const isCompleted = completedLocationIds.includes(locationId);
                  const isSelected = selectedInventoryId === locationId;

                  return (
                    <button
                      key={locationId}
                      type="button"
                      className={`map-location-card${isUnlocked ? " map-location-card--unlocked" : ""}${isCompleted ? " map-location-card--completed" : ""}${isSelected ? " map-location-card--selected" : ""}`}
                      style={{ "--card-bg": `url(${location.background})` }}
                      onClick={() => setSelectedInventoryId(locationId)}
                    >
                      <span className="map-location-order">{index + 1}</span>
                      <span className="map-location-status">
                        {isCompleted ? "Concluido" : isUnlocked ? "Liberado" : "Bloqueado"}
                      </span>
                      <strong>{location.title}</strong>
                    </button>
                  );
                })}
              </div>

              <aside className="map-inventory-detail">
                <p className="map-detail-kicker">
                  {completedLocationIds.includes(selectedInventoryId)
                    ? "Area restaurada"
                    : unlockedLocationIds.has(selectedInventoryId)
                      ? "Acesso liberado"
                      : "Ainda bloqueado"}
                </p>
                <h3>{selectedLocationInfo.title}</h3>
                <p>{selectedLocationInfo.description}</p>
                <p>{selectedLocationInfo.info}</p>
                <div className="map-detail-reward">
                  <span>Recompensa</span>
                  <strong>{selectedLocationInfo.reward} moedas</strong>
                </div>
                <button
                  type="button"
                  className="map-detail-action"
                  onClick={enterSelectedLocation}
                  disabled={!unlockedLocationIds.has(selectedInventoryId)}
                >
                  <Play aria-hidden="true" />
                  Ir para local
                </button>
              </aside>
            </div>
          </section>
        </div>
      )}

      {enteringLocationId && (
        <div className="map-entry-transition" aria-live="polite">
          <div className="map-entry-ring" />
          <div className="map-entry-card">
            <span>Entrando em</span>
            <strong>{LOCATION_INFO[enteringLocationId].title}</strong>
          </div>
        </div>
      )}

      {activeRevealId && (
        <div className="map-color-reveal-banner" aria-live="polite">
          <span>Area restaurada</span>
          <strong>{LOCATION_INFO[activeRevealId].title} voltou a ter cor!</strong>
        </div>
      )}

    </div>
  );
}
