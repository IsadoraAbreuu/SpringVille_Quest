export default function Location({ setCurrentPage }) {
  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => setCurrentPage('home')}>
        ← Voltar
      </button>
      <h1>📍 Local Selecionado</h1>
      <div style={styles.content}>
        <h2>Você está em um local especial em SpringVille</h2>
        <p>Aqui você pode explorar e descobrir coisas interessantes!</p>
        <div style={styles.infoBox}>
          <h3>📌 Informações:</h3>
          <ul>
            <li>Descrição do local</li>
            <li>Pontos de interesse</li>
            <li>Missões disponíveis</li>
          </ul>
        </div>
        <button style={styles.btn} onClick={() => setCurrentPage('mapa')}>
          Ir para o Mapa
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  backBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  content: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  btn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
