export default function Mapa({ setCurrentPage }) {
  const places = [
    { id: "escola", name: "🏫 Escola" },
    { id: "lanchonete", name: "🍔 Lanchonete" },
    { id: "casa", name: "🏠 Casa" },
  ];

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => setCurrentPage('home')}>
        ← Voltar
      </button>
      <h1>🗺️ Mapa de SpringVille</h1>

      <div style={styles.mapGrid}>
        {places.map((p) => (
          <button
            key={p.id}
            style={styles.placeBtn}
            onClick={() => setCurrentPage('location')}
          >
            {p.name}
          </button>
        ))}
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
    textAlign: 'center',
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
  mapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '30px',
  },
  placeBtn: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '20px',
    borderRadius: '8px',
    fontSize: '1.5rem',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};