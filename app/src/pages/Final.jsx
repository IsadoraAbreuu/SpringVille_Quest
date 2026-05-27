import { Coins, PartyPopper, RotateCcw, Sparkles } from 'lucide-react';
import rosquinha from '../assets/images/rosquinha.svg';
import './final.css';

const CELEBRATION_COINS = Array.from({ length: 18 }, (_, index) => index);
const DONUTS = Array.from({ length: 9 }, (_, index) => ({
  index,
  bottom: `${7 + (index % 3) * 14}%`,
}));

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

      <section className="final-card" aria-label="Cidade restaurada">
        <p className="final-kicker">
          <PartyPopper aria-hidden="true" />
          Cidade restaurada
        </p>

        <h1>SpringVille voltou a sorrir!</h1>

        <div className="final-wallet" aria-label={`${totalCoins} moedas conquistadas`}>
          <span className="final-wallet__icon">
            <Coins aria-hidden="true" />
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

        <div className="final-highlights">
          <div>
            <Sparkles aria-hidden="true" />
            <span>5 locais restaurados</span>
          </div>
          <div>
            <img src={rosquinha} alt="" />
            <span>Rosquinhas garantidas</span>
          </div>
          <div>
            <Coins aria-hidden="true" />
            <span>Moedas viraram felicidade</span>
          </div>
        </div>

        <button type="button" className="final-restart" onClick={onRestart}>
          <RotateCcw aria-hidden="true" />
          Jogar novamente
        </button>
      </section>
    </main>
  );
}
