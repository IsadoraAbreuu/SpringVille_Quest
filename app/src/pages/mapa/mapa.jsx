import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import mapaColorido from "../../assets/images/mapa/mapa.svg";
import mapaGray from "../../assets/images/mapa/mapa-gray.svg";
import casaStage from "../../assets/images/mapa/casa.svg";
import escolaStage from "../../assets/images/mapa/escola.svg";
import parqueStage from "../../assets/images/mapa/parque.svg";
import prefeituraStage from "../../assets/images/mapa/prefeitura.svg";
import "./mapa.css";

const POINTS = [
  { id: "escola", label: "Escola", x: 38, y: 28 },
  { id: "mercado", label: "Mercado", x: 61, y: 38 },
  { id: "casa", label: "Casa", x: 46, y: 50 },
  { id: "parque", label: "Parque", x: 48, y: 80 },
  { id: "prefeitura", label: "Prefeitura", x: 67, y: 9 },
];

const QUEST_ORDER = ["parque", "prefeitura", "escola", "casa", "mercado"];

const MAP_STAGE_OVERLAYS = {
  parque: parqueStage,
  prefeitura: prefeituraStage,
  escola: escolaStage,
  casa: casaStage,
};

export default function Mapa({
  completedLocationIds = [],
  nextUnlockedLocationId,
  setCurrentPage,
}) {
  const viewportRef = useRef(null);
  const worldRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
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
      const world = worldRef.current.getBoundingClientRect();
      const left = Math.min(0, viewport.width - world.width);
      const top = Math.min(0, viewport.height - world.height);

      setDragConstraints({
        left,
        right: 0,
        top,
        bottom: 0,
      });

      x.set(left / 2);
      y.set(top / 2);
    };

    updateDragArea();
    window.addEventListener("resize", updateDragArea);

    return () => {
      window.removeEventListener("resize", updateDragArea);
    };
  }, [x, y]);

  const hasCompletedQuest = completedLocationIds.includes("mercado");
  const lastCompletedLocationId = completedLocationIds[completedLocationIds.length - 1];
  const grayOverlay = hasCompletedQuest
    ? null
    : MAP_STAGE_OVERLAYS[lastCompletedLocationId] || mapaGray;
  const unlockedLocationIds = new Set([
    ...completedLocationIds,
    ...(nextUnlockedLocationId ? [nextUnlockedLocationId] : []),
  ]);

  return (
    <div className="mapa-viewport" ref={viewportRef}>
      <motion.div
        ref={worldRef}
        className="mapa-world"
        drag
        dragConstraints={dragConstraints}
        dragElastic={0.04}
        dragMomentum={false}
        style={{ x, y }}
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

        <div className="map-progress-panel">
          <strong>Restaurar a Cidade</strong>
          <span>
            {completedLocationIds.length} / {QUEST_ORDER.length} areas coloridas
          </span>
        </div>

        {POINTS.map((point) => {
          const isCompleted = completedLocationIds.includes(point.id);
          const isUnlocked = unlockedLocationIds.has(point.id);
          const statusLabel = isCompleted
            ? "Concluido"
            : isUnlocked
              ? "Liberado"
              : "Bloqueado";

          return (
            <button
              key={point.id}
              className={`map-pin${isCompleted ? " map-pin--completed" : ""}${!isUnlocked ? " map-pin--locked" : ""}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
              onClick={() => {
                if (isUnlocked) {
                  setCurrentPage(point.id);
                }
              }}
              disabled={!isUnlocked}
              title={`${point.label} - ${statusLabel}`}
              aria-label={`${point.label} - ${statusLabel}`}
            >
              {isCompleted ? "✓" : isUnlocked ? "!" : "×"}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
