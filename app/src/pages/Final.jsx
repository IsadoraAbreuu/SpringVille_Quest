export default function Final({ setCurrentPage }) {
  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => setCurrentPage('home')}>
        ← Voltar
      </button>
      <div style={styles.celebrationBox}>
        <h1 style={styles.title}>🎉 Parabéns! 🎉</h1>
        <p style={styles.subtitle}>Você completou a SpringVille Quest!</p>
        <div style={styles.stats}>
          <h2>📊 Seus Resultados:</h2>
          <ul>
            <li>✅ 3 Locais Explorados</li>
            <li>✅ 5 Missões Completadas</li>
            <li>⭐ 100 Pontos</li>
          </ul>
        </div>
      </div>
      <button
        style={styles.restartBtn}
        onClick={() => setCurrentPage('home')}
      >
        🔄 Jogar Novamente
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    marginBottom: '20px',
  },
  celebrationBox: {
    backgroundColor: '#fff9e6',
    border: '3px solid #ffc107',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '3rem',
    color: '#ff6f00',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#666',
    marginBottom: '20px',
  },
  stats: {
    backgroundColor: '#e8f5e9',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px 0',
  },
  restartBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  },
};
