import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Building2, Coins, GraduationCap, Home, ShoppingBasket, Trees } from 'lucide-react';
import springvilleFallback from '../../assets/images/fundo-springville.png';
import casaBackground from '../../assets/images/locais/casa.jpg';
import escolaBackground from '../../assets/images/locais/escola.jpg';
import mercadoBackground from '../../assets/images/locais/mercado.jpg';
import parqueBackground from '../../assets/images/locais/parque.jpg';
import prefeituraBackground from '../../assets/images/locais/prefeitura.jpg';
import bartGuide from '../../assets/images/personagens/bart.svg';
import bartGuideActive from '../../assets/images/personagens/bart2.svg';
import homerGuide from '../../assets/images/personagens/homer.svg';
import homerGuideActive from '../../assets/images/personagens/homer2.svg';
import lisaGuide from '../../assets/images/personagens/liza.svg';
import lisaGuideActive from '../../assets/images/personagens/liza2.svg';
import margeGuide from '../../assets/images/personagens/marge.svg';
import margeGuideActive from '../../assets/images/personagens/marge2.svg';
import './location.css';

const QUESTS = {
  parque: {
    title: 'Parque de SpringVille',
    subtitle: 'Primeira parada para recuperar as cores da cidade.',
    background: parqueBackground,
    reward: 10,
    tasks: [
      {
        type: 'quiz',
        prompt: 'Qual personagem costuma andar de skate e vive aprontando na escola?',
        options: ['Bart', 'Milhouse', 'Nelson', 'Ralph'],
        answer: 'Bart',
      },
      {
        type: 'order',
        prompt: 'Arraste e organize a cena do piquenique no parque.',
        options: ['Escolher uma mesa', 'Abrir a cesta', 'Dividir os lanches', 'Limpar o local'],
        answer: ['Escolher uma mesa', 'Abrir a cesta', 'Dividir os lanches', 'Limpar o local'],
      },
    ],
  },
  prefeitura: {
    title: 'Prefeitura de SpringVille',
    subtitle: 'Decisoes importantes precisam de atencao aos detalhes.',
    background: prefeituraBackground,
    reward: 12,
    tasks: [
      {
        type: 'quiz',
        prompt: 'Quem e o dono da usina nuclear onde Homer trabalha?',
        options: ['Sr. Burns', 'Apu', 'Krusty', 'Moe'],
        answer: 'Sr. Burns',
      },
      {
        type: 'order',
        prompt: 'Arraste e organize os documentos da prefeitura na ordem certa.',
        options: ['Receber pedido', 'Carimbar formulario', 'Arquivar registro', 'Liberar aprovacao'],
        answer: ['Receber pedido', 'Carimbar formulario', 'Arquivar registro', 'Liberar aprovacao'],
      },
    ],
  },
  escola: {
    title: 'Escola de SpringVille',
    subtitle: 'Um desafio rapido antes do sinal tocar.',
    background: escolaBackground,
    reward: 14,
    tasks: [
      {
        type: 'quiz',
        prompt: 'Qual personagem e conhecida por tocar saxofone?',
        options: ['Lisa', 'Marge', 'Maggie', 'Patty'],
        answer: 'Lisa',
      },
      {
        type: 'order',
        prompt: 'Arraste e organize a rotina antes da aula comecar.',
        options: ['Pegar o material', 'Entrar na sala', 'Responder chamada', 'Comecar a atividade'],
        answer: ['Pegar o material', 'Entrar na sala', 'Responder chamada', 'Comecar a atividade'],
      },
    ],
  },
  casa: {
    title: 'Casa da Familia',
    subtitle: 'O lar tambem guarda uma parte da aventura.',
    background: casaBackground,
    reward: 16,
    tasks: [
      {
        type: 'quiz',
        prompt: 'Qual e o doce favorito do Homer?',
        options: ['Rosquinha', 'Torta de maca', 'Cupcake', 'Sorvete'],
        answer: 'Rosquinha',
      },
      {
        type: 'order',
        prompt: 'Arraste e organize a sala para a familia assistir TV.',
        options: ['Guardar brinquedos', 'Arrumar o sofa', 'Preparar petiscos', 'Ligar a TV'],
        answer: ['Guardar brinquedos', 'Arrumar o sofa', 'Preparar petiscos', 'Ligar a TV'],
      },
    ],
  },
  mercado: {
    title: 'Mercado Kwik-E-Mart',
    subtitle: 'Ultima parada antes de devolver todas as cores.',
    background: mercadoBackground,
    reward: 18,
    tasks: [
      {
        type: 'quiz',
        prompt: 'Quem trabalha no Kwik-E-Mart?',
        options: ['Apu', 'Barney', 'Skinner', 'Lenny'],
        answer: 'Apu',
      },
      {
        type: 'order',
        prompt: 'Arraste e organize a compra final no mercado.',
        options: ['Pegar carrinho', 'Escolher produtos', 'Passar no caixa', 'Guardar recibo'],
        answer: ['Pegar carrinho', 'Escolher produtos', 'Passar no caixa', 'Guardar recibo'],
      },
    ],
  },
  location: {
    title: 'Local Selecionado',
    subtitle: 'Complete as tasks para ganhar moedas.',
    background: springvilleFallback,
    reward: 10,
    tasks: [],
  },
};

const TASK_ADVANCE_DELAY = 1800;
const CLUE_REVEAL_DELAY = 1800;
const COLOR_PURCHASE_COST = 1;
const COLOR_PURCHASE_DELAY = 1250;
const COIN_LOSS_PULSE_DELAY = 720;

const NEXT_LOCATION_CLUES = {
  parque: {
    clue: 'A proxima pista esta em um lugar onde as decisoes da cidade sao registradas e carimbadas.',
  },
  prefeitura: {
    clue: 'Agora procure um lugar cheio de carteiras, lousa e desafios antes do sinal tocar.',
  },
  escola: {
    clue: 'A pista seguinte esta onde a familia se reune no sofa depois de um dia agitado.',
  },
  casa: {
    clue: 'A ultima pista espera em um lugar de prateleiras, compras rapidas e caixa registradora.',
  },
  mercado: {
    clue: 'Voce juntou todas as pistas. A cidade esta pronta para revelar o resultado da aventura.',
  },
};

const GUIDE_CHARACTERS = {
  bart: { name: 'Bart', image: bartGuide, activeImage: bartGuideActive },
  homer: { name: 'Homer', image: homerGuide, activeImage: homerGuideActive },
  lisa: { name: 'Lisa', image: lisaGuide, activeImage: lisaGuideActive },
  marge: { name: 'Marge', image: margeGuide, activeImage: margeGuideActive },
};

const LOCATION_BADGES = {
  parque: { label: 'Parque', Icon: Trees },
  prefeitura: { label: 'Prefeitura', Icon: Building2 },
  escola: { label: 'Escola', Icon: GraduationCap },
  casa: { label: 'Casa', Icon: Home },
  mercado: { label: 'Mercado', Icon: ShoppingBasket },
  location: { label: 'Local', Icon: Trees },
};

const SUCCESS_MESSAGES = {
  bart: 'Boa! Essa foi esperta. SpringVille acabou de ganhar mais uma dose de atitude.',
  homer: 'Woo-hoo! Mandou bem demais. Essas moedas ja estao quase fazendo barulho no bolso.',
  lisa: 'Excelente! Resposta certinha e cidade um pouco mais organizada.',
  marge: 'Muito bem! Continue assim que a cidade vai ficar linda de novo.',
};

function shuffleItems(items) {
  if (items.length < 2) {
    return [...items];
  }

  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[randomIndex]] = [shuffledItems[randomIndex], shuffledItems[index]];
  }

  return arraysMatch(shuffledItems, items) ? shuffleItems(items) : shuffledItems;
}

function arraysMatch(first, second) {
  return first.length === second.length && first.every((item, index) => item === second[index]);
}

export default function Location({
  locationId = 'location',
  isCompleted = false,
  isUnlocked = true,
  selectedCharacterId = 'homer',
  totalCoins = 0,
  onEarnCoins,
  onSpendCoins,
  onCompleteLocation,
  setCurrentPage,
}) {
  const quest = QUESTS[locationId] || QUESTS.location;
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [quizOptions, setQuizOptions] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showClue, setShowClue] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [orderMistakes, setOrderMistakes] = useState(0);
  const [isGuideLeaving, setIsGuideLeaving] = useState(false);
  const [guideMessage, setGuideMessage] = useState('');
  const [isBuyingColor, setIsBuyingColor] = useState(false);
  const [coinLossPulse, setCoinLossPulse] = useState(0);
  const [isOrderHintDismissed, setIsOrderHintDismissed] = useState(false);

  const currentTask = quest.tasks[taskIndex];
  const isLastTask = taskIndex === quest.tasks.length - 1;
  const nextClue = NEXT_LOCATION_CLUES[locationId];
  const guideCharacter = GUIDE_CHARACTERS[selectedCharacterId] || GUIDE_CHARACTERS.homer;
  const guideSuccessMessage = SUCCESS_MESSAGES[selectedCharacterId] || SUCCESS_MESSAGES.homer;
  const locationBadge = LOCATION_BADGES[locationId] || LOCATION_BADGES.location;
  const LocationIcon = locationBadge.Icon;
  const shouldShowOrderHint = currentTask?.type === 'order' && orderMistakes >= 5 && !isOrderHintDismissed;
  const shouldShowGuideBubble = Boolean(guideMessage) || shouldShowOrderHint;

  useEffect(() => {
    setTaskIndex(0);
    setSelectedOption('');
    setQuizOptions([]);
    setFeedback('');
    setDraggedItem('');
    setShowClue(false);
    setIsAdvancing(false);
    setOrderMistakes(0);
    setIsGuideLeaving(false);
    setGuideMessage('');
    setIsBuyingColor(false);
    setCoinLossPulse(0);
    setIsOrderHintDismissed(false);
  }, [locationId]);

  useEffect(() => {
    if (currentTask?.type === 'quiz') {
      setQuizOptions(shuffleItems(currentTask.options));
      setOrderedItems([]);
    } else if (currentTask?.type === 'order') {
      setOrderedItems(shuffleItems(currentTask.options));
      setQuizOptions([]);
    } else {
      setQuizOptions([]);
      setOrderedItems([]);
    }

    setSelectedOption('');
    setFeedback('');
    setDraggedItem('');
    setIsAdvancing(false);
    setOrderMistakes(0);
    setGuideMessage('');
    setIsOrderHintDismissed(false);
  }, [currentTask]);

  useEffect(() => {
    if (!coinLossPulse) {
      return undefined;
    }

    const coinLossTimer = window.setTimeout(() => {
      setCoinLossPulse(0);
    }, COIN_LOSS_PULSE_DELAY);

    return () => {
      window.clearTimeout(coinLossTimer);
    };
  }, [coinLossPulse]);

  const leaveLocationPage = (callback) => {
    setIsGuideLeaving(true);
    window.setTimeout(callback, 480);
  };

  const moveOrderedItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= orderedItems.length) {
      return;
    }

    setOrderedItems((items) => {
      const nextItems = [...items];
      const [movedItem] = nextItems.splice(fromIndex, 1);
      nextItems.splice(toIndex, 0, movedItem);
      return nextItems;
    });
  };

  const handleDrop = (targetItem) => {
    if (!draggedItem || draggedItem === targetItem) {
      return;
    }

    const fromIndex = orderedItems.indexOf(draggedItem);
    const toIndex = orderedItems.indexOf(targetItem);
    moveOrderedItem(fromIndex, toIndex);
    setDraggedItem('');
  };

  const completeTask = () => {
    setIsAdvancing(true);
    setGuideMessage(guideSuccessMessage);
    onEarnCoins?.(quest.reward);

    if (isLastTask) {
      setFeedback(`Task completa! Voce ganhou ${quest.reward} moedas.`);
      window.setTimeout(() => setShowClue(true), CLUE_REVEAL_DELAY);
      return;
    }

    setFeedback(`Boa! Voce ganhou ${quest.reward} moedas.`);
    window.setTimeout(() => setTaskIndex((currentIndex) => currentIndex + 1), TASK_ADVANCE_DELAY);
  };

  const finishLocation = () => {
    leaveLocationPage(() => onCompleteLocation?.(locationId));
  };

  const buyColorAndFinish = () => {
    if (isBuyingColor) {
      return;
    }

    setIsBuyingColor(true);
    onSpendCoins?.(COLOR_PURCHASE_COST);

    window.setTimeout(() => {
      finishLocation();
    }, COLOR_PURCHASE_DELAY);
  };

  const returnToMap = () => {
    leaveLocationPage(() => setCurrentPage('mapa'));
  };

  const checkAnswer = () => {
    if (!currentTask || !isUnlocked || isCompleted || isAdvancing) {
      return;
    }

    if (currentTask.type === 'quiz') {
      if (!selectedOption) {
        setFeedback('Escolha uma alternativa para responder.');
        setGuideMessage('');
        return;
      }

      if (selectedOption !== currentTask.answer) {
        onSpendCoins?.(1);
        setCoinLossPulse((currentPulse) => currentPulse + 1);
        setFeedback('Quase! Voce perdeu 1 moeda, tente outra alternativa.');
        setGuideMessage('');
        return;
      }

      completeTask();
      return;
    }

    if (!arraysMatch(orderedItems, currentTask.answer)) {
      const nextOrderMistakes = orderMistakes + 1;
      onSpendCoins?.(1);
      setCoinLossPulse((currentPulse) => currentPulse + 1);
      setOrderMistakes(nextOrderMistakes);
      setIsOrderHintDismissed(false);
      setGuideMessage('');
      setFeedback(
        nextOrderMistakes >= 5
          ? 'A ordem ainda nao esta certa. Voce perdeu 1 moeda. Use a dica para ajustar os cards.'
          : 'A ordem ainda nao esta certa. Voce perdeu 1 moeda. Ajuste os cards e tente de novo.'
      );
      return;
    }

    completeTask();
  };

  return (
    <div
      className="location-page"
      style={{ '--location-bg': `url(${quest.background})` }}
    >
      <div className="location-overlay" />

      <main className="location-shell">
        <header className="location-topbar">
          <button className="location-back" onClick={returnToMap}>
            <ArrowLeft aria-hidden="true" />
            Voltar ao mapa
          </button>

          <div className={`location-stats${coinLossPulse ? ' location-stats--loss' : ''}`} aria-label="Moedas acumuladas">
            <span>Moedas</span>
            <strong>{totalCoins}</strong>
            {coinLossPulse > 0 && (
              <small key={coinLossPulse} className="location-coin-loss">
                -1
              </small>
            )}
          </div>
        </header>

        <section className="quest-panel">
          <p className="quest-kicker">
            <LocationIcon aria-hidden="true" />
            {quest.tasks.length ? `${Math.min(taskIndex + 1, quest.tasks.length)} de ${quest.tasks.length} do ${locationBadge.label}` : locationBadge.label}
          </p>
          <h1>{quest.title}</h1>
          <p className="quest-subtitle">{quest.subtitle}</p>

          {!isUnlocked && (
            <p className="quest-message quest-message--warning">
              Complete a task atual no mapa para desbloquear este local.
            </p>
          )}

          {isCompleted && (
            <p className="quest-message quest-message--success">
              Esta parte da cidade ja voltou a ficar colorida.
            </p>
          )}

          {isUnlocked && !isCompleted && showClue && (
            <div className="clue-screen">
              <p className="clue-label">Dica desbloqueada</p>
              <h2>Siga a pista</h2>
              <p>{nextClue?.clue || 'Volte ao mapa para continuar a aventura.'}</p>

              <div className="color-purchase">
                <span className="color-purchase__coin" aria-hidden="true">
                  $
                </span>
                <div>
                  <strong>Restaurar essa area</strong>
                  <p>Compre para restaurar esse pedaco da cidade ate SpringVille toda voltar a ficar alegre e colorida.</p>
                </div>
              </div>

              <button className="task-submit clue-continue" onClick={buyColorAndFinish} disabled={isBuyingColor}>
                {isBuyingColor ? 'Colorindo...' : 'Comprar'}
              </button>
            </div>
          )}

          {isUnlocked && !isCompleted && currentTask && !showClue && (
            <div className="task-area">
              <div className="task-heading">
                <span>{currentTask.type === 'quiz' ? 'Quiz' : 'Drag and drop'}</span>
                <strong>
                  <Coins aria-hidden="true" />
                  +{quest.reward} moedas
                </strong>
              </div>

              <h2>{currentTask.prompt}</h2>

              {currentTask.type === 'quiz' ? (
                <div className="answer-grid">
                  {quizOptions.map((option, index) => (
                    <button
                      key={option}
                      className={`answer-option${selectedOption === option ? ' answer-option--selected' : ''}`}
                      onClick={() => {
                        setSelectedOption(option);
                        setFeedback('');
                      }}
                    >
                      <span>{String.fromCharCode(65 + index)}</span>
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="order-list">
                  {orderedItems.map((item, index) => (
                    <div
                      key={item}
                      className="order-item"
                      draggable
                      onDragStart={() => setDraggedItem(item)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDrop(item)}
                    >
                      <span>{index + 1}</span>
                      <strong>{item}</strong>
                      <div className="order-item__controls" aria-label={`Mover ${item}`}>
                        <button
                          type="button"
                          className="order-item__control"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOrderedItem(index, index - 1);
                          }}
                          disabled={index === 0}
                          aria-label={`Subir ${item}`}
                        >
                          <ArrowUp aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="order-item__control"
                          onClick={(event) => {
                            event.stopPropagation();
                            moveOrderedItem(index, index + 1);
                          }}
                          disabled={index === orderedItems.length - 1}
                          aria-label={`Descer ${item}`}
                        >
                          <ArrowDown aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {feedback && <p className="task-feedback">{feedback}</p>}

              <button className="task-submit" onClick={checkAnswer} disabled={isAdvancing}>
                {isLastTask ? 'Finalizar local' : 'Responder'}
              </button>

              {isLastTask && (
                <p className="next-hint">
                  Ao finalizar, uma tela de dica vai revelar o proximo destino.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      {isUnlocked && !isCompleted && (
        <aside
          className={`location-guide${shouldShowGuideBubble ? ' location-guide--talking' : ''}${isGuideLeaving ? ' location-guide--leaving' : ''}`}
          aria-live={shouldShowGuideBubble ? 'polite' : 'off'}
        >
          {shouldShowGuideBubble && (
            <div className="location-guide__bubble">
              <span>{guideCharacter.name}</span>
              {guideMessage ? (
                <p>{guideMessage}</p>
              ) : (
                <>
                  <button
                    type="button"
                    className="location-guide__bubble-close"
                    onClick={() => setIsOrderHintDismissed(true)}
                    aria-label="Fechar dica"
                  >
                    x
                  </button>
                  <p>Olha a ordem certa para destravar essa parte:</p>
                  <ol>
                    {currentTask.answer.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )}

          <div className="location-guide__crop" aria-hidden="true">
            <img src={guideCharacter.image} alt="" className="location-guide__image location-guide__image--idle" />
            <img src={guideCharacter.activeImage} alt="" className="location-guide__image location-guide__image--active" />
          </div>
        </aside>
      )}

      {isBuyingColor && (
        <div className="color-buy-transition" aria-live="polite">
          <div className="color-buy-transition__burst" />
          <div className="color-buy-transition__card">
            <span className="color-buy-transition__coin">$</span>
            <strong>Restaurando...</strong>
          </div>
        </div>
      )}
    </div>
  );
}
