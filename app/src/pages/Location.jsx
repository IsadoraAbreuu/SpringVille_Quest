const LOCATIONS = {
  escola: {
    title: 'Escola de SpringVille',
    subtitle: 'Hora de encarar uma missao de conhecimento.',
    description:
      'Explore a escola, converse com os personagens e encontre pistas para continuar a aventura.',
    items: ['Sala de aula', 'Biblioteca', 'Quadra de esportes'],
  },
  mercado: {
    title: 'Mercado Kwik-E-Mart',
    subtitle: 'A ultima parada para devolver cor para toda a cidade.',
    description:
      'Procure o ultimo item da quest e complete a restauracao de SpringVille.',
    items: ['Lista final', 'Prateleiras secretas', 'Ultima pista'],
  },
  casa: {
    title: 'Casa da Familia',
    subtitle: 'O lar tambem guarda partes da quest.',
    description:
      'Investigue os comodos da casa e junte as ultimas pistas antes de seguir para o final.',
    items: ['Sala de estar', 'Cozinha', 'Quarto dos personagens'],
  },
  parque: {
    title: 'Parque de SpringVille',
    subtitle: 'A primeira area que pode voltar a ter cor.',
    description:
      'Caminhe pelo parque, encontre personagens escondidos e desbloqueie o proximo desafio.',
    items: ['Lago central', 'Area de piquenique', 'Trilha das pistas'],
  },
  prefeitura: {
    title: 'Prefeitura de SpringVille',
    subtitle: 'O centro das decisoes importantes da cidade.',
    description:
      'Visite a prefeitura para descobrir documentos, conversas e pistas sobre a proxima etapa.',
    items: ['Gabinete principal', 'Arquivo da cidade', 'Mural de avisos'],
  },
  location: {
    title: 'Local Selecionado',
    subtitle: 'Voce esta em um local especial em SpringVille.',
    description: 'Aqui voce pode explorar e descobrir coisas interessantes.',
    items: ['Descricao do local', 'Pontos de interesse', 'Missoes disponiveis'],
  },
};

const LOCATION_LABELS = {
  parque: 'Parque',
  prefeitura: 'Prefeitura',
  escola: 'Escola',
  casa: 'Casa',
  mercado: 'Mercado',
};

export default function Location({
  locationId = 'location',
  isCompleted = false,
  isUnlocked = true,
  nextUnlockedLocationId,
  onCompleteLocation,
  setCurrentPage,
}) {
  const location = LOCATIONS[locationId] || LOCATIONS.location;
  const nextLocationLabel = nextUnlockedLocationId
    ? LOCATION_LABELS[nextUnlockedLocationId]
    : null;

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <button style={styles.backBtn} onClick={() => setCurrentPage('mapa')}>
          Voltar ao mapa
        </button>

        <section style={styles.content}>
          <p style={styles.kicker}>
            {isCompleted ? 'Area restaurada' : isUnlocked ? 'Task liberada' : 'Task bloqueada'}
          </p>
          <h1 style={styles.title}>{location.title}</h1>
          <h2 style={styles.subtitle}>{location.subtitle}</h2>
          <p style={styles.description}>{location.description}</p>

          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>Objetivos:</h3>
            <ul style={styles.list}>
              {location.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {!isUnlocked && (
            <p style={styles.lockedMessage}>
              Complete a task atual no mapa para desbloquear este local.
            </p>
          )}

          {isCompleted && (
            <p style={styles.completedMessage}>
              Esta parte da cidade ja voltou a ficar colorida.
            </p>
          )}

          <div style={styles.actions}>
            <button style={styles.secondaryBtn} onClick={() => setCurrentPage('mapa')}>
              Ir para o mapa
            </button>

            <button
              style={{
                ...styles.completeBtn,
                ...((!isUnlocked || isCompleted) ? styles.completeBtnDisabled : {}),
              }}
              onClick={() => onCompleteLocation?.(locationId)}
              disabled={!isUnlocked || isCompleted}
            >
              {isCompleted ? 'Concluido' : 'Concluir task'}
            </button>
          </div>

          {isUnlocked && !isCompleted && nextLocationLabel && (
            <p style={styles.nextHint}>
              Ao concluir, uma nova area sera revelada no mapa.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '22px',
    background: 'linear-gradient(180deg, #d7ecff 0%, #f6fbff 100%)',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    width: 'min(860px, 100%)',
    margin: '0 auto',
  },
  backBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '18px',
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 'clamp(22px, 4vw, 34px)',
    borderRadius: '8px',
    boxShadow: '0 18px 42px rgba(18, 58, 91, 0.14)',
  },
  kicker: {
    margin: '0 0 10px',
    color: '#2f6fa7',
    fontSize: '0.78rem',
    fontWeight: 900,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    color: '#103c63',
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    lineHeight: 1,
  },
  subtitle: {
    margin: '14px 0 0',
    color: '#25516f',
    fontSize: 'clamp(1.1rem, 3vw, 1.45rem)',
  },
  description: {
    margin: '14px 0 0',
    color: 'rgba(16, 60, 99, 0.84)',
    lineHeight: 1.65,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '22px',
    marginBottom: '20px',
  },
  infoTitle: {
    margin: '0 0 10px',
    color: '#103c63',
  },
  list: {
    margin: 0,
    paddingLeft: '22px',
    lineHeight: 1.7,
  },
  lockedMessage: {
    color: '#8a4b00',
    fontWeight: 800,
  },
  completedMessage: {
    color: '#14743a',
    fontWeight: 800,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  secondaryBtn: {
    backgroundColor: '#4D96FF',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 800,
  },
  completeBtn: {
    background: 'linear-gradient(135deg, #ffd34f 0%, #ff952d 100%)',
    color: '#143352',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 900,
  },
  completeBtnDisabled: {
    opacity: 0.58,
    cursor: 'not-allowed',
  },
  nextHint: {
    margin: '14px 0 0',
    color: 'rgba(16, 60, 99, 0.72)',
    fontSize: '0.92rem',
  },
};
