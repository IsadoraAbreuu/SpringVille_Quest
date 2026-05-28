import { PartyPopper, RotateCcw } from 'lucide-react';
import rosquinha from '../../assets/images/rosquinha.svg';
import bart from '../../assets/images/personagens/bart2.svg';
import homer from '../../assets/images/personagens/homer2.svg';
import lisa from '../../assets/images/personagens/liza2.svg';
import marge from '../../assets/images/personagens/marge2.svg';
import './final.css';

const CELEBRATION_COINS = Array.from({ length: 18 }, (_, index) => index);
const DONUTS = Array.from({ length: 9 }, (_, index) => ({
  index,
  bottom: `${7 + (index % 3) * 14}%`,
}));

const CELEBRATING_CHARACTERS = [
  { name: 'Bart', image: bart },
  { name: 'Homer', image: homer },
  { name: 'Lisa', image: lisa },
  { name: 'Marge', image: marge },
];

export default function Final({ totalCoins = 0, onRestart }) {
  return (
    <main className="final-page">
      <div className="final-sky" aria-hidden="true" />

      <div className="final-confetti" aria-hidden="true">
        {CELEBRATION_COINS.map((coin) => (
          <span key={coin} className="final-confetti__coin" style={{ '--coin-index': coin }} />
        ))}
      </div>

      <div className="final-donuts" aria-hidden="true">
        {DONUTS.map((donut) => (
          <img
            key={donut.index}
            src={rosquinha}
            alt=""
            style={{ '--donut-index': donut.index, '--donut-bottom': donut.bottom }}
          />
        ))}
      </div>

      <div className="final-characters" aria-hidden="true">
        {CELEBRATING_CHARACTERS.map((character, index) => (
          <img
            key={character.name}
            src={character.image}
            alt=""
            style={{ '--character-index': index }}
          />
        ))}
      </div>

      <section className="final-card" aria-label="Cidade restaurada">
        <p className="final-kicker">
          <PartyPopper aria-hidden="true" />
          Cidade restaurada
        </p>

        <h1>SpringVille voltou a sorrir!</h1>

        <div className="final-wallet" aria-label={`${totalCoins} moedas conquistadas`}>
          <span className="final-wallet__icon">
            <span className="final-asset-icon final-asset-icon--coin" aria-hidden="true" />
          </span>
          <div>
            <strong>{totalCoins}</strong>
            <span>moedas conquistadas</span>
          </div>
        </div>

        <p className="final-story">
          Com essas moedas, vai dar para comprar rosquinhas para a cidade toda. As ruas ganharam cor,
          os lugares foram restaurados e todo mundo em SpringVille tem um motivo para comemorar.
        </p>

        <button type="button" className="final-restart" onClick={onRestart}>
          <RotateCcw aria-hidden="true" />
          Jogar novamente
        </button>
      </section>
    </main>
  );
}
