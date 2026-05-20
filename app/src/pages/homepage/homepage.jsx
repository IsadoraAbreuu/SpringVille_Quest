import './homepage.css';
import backgroundImage from '../../assets/images/fundo-springville.png';
import logoSpringville from '../../assets/images/logo-springville.svg';

export default function Home({ logoReveal = 1 }) {
  return (
    <main className="homepage">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="homepage__background"
      />
      <div className="homepage__overlay" />
      <header className="homepage__header">
        <img
          src={logoSpringville}
          alt="SpringVille"
          style={{
            opacity: logoReveal,
            transform: `translateY(${24 - logoReveal * 24}px) scale(${0.94 + logoReveal * 0.06})`,
          }}
          className="homepage__logo"
        />
      </header>
    </main>
  );
}
