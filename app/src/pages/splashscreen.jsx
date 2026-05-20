import backgroundImage from '../assets/images/fundo-springville.png';
import rosquinha from '../assets/images/rosquinha.svg';

export default function Splashscreen({ isExiting }) {
	return (
		<div
			style={{
				...styles.wrapper,
				...(isExiting ? styles.wrapperExit : null),
			}}
		>
			<img
				src={backgroundImage}
				alt=""
				aria-hidden="true"
				style={{
					...styles.background,
					...(isExiting ? styles.backgroundExit : null),
				}}
			/>
			<div style={styles.overlay} />
			<div style={styles.loaderArea}>
				<img src={rosquinha} alt="Carregando SpringVille" style={styles.donut} />
			</div>
		</div>
	);
}

const styles = {
	wrapper: {
		position: 'fixed',
		inset: 0,
		zIndex: 20,
		overflow: 'hidden',
		transition: 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 1.2s ease',
	},
	wrapperExit: {
		transform: 'translateY(-100%)',
		opacity: 0.25,
	},
	background: {
		position: 'absolute',
		inset: 0,
		width: '100%',
		height: '100%',
		objectFit: 'cover',
		objectPosition: 'center top',
		transform: 'scale(1.04)',
		transition: 'transform 1.6s cubic-bezier(0.22, 1, 0.36, 1), object-position 1.6s cubic-bezier(0.22, 1, 0.36, 1)',
	},
	backgroundExit: {
		transform: 'scale(1)',
		objectPosition: 'center 12%',
	},
	overlay: {
		position: 'absolute',
		inset: 0,
		background: 'linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.44) 45%, rgba(255,255,255,0.20) 100%)',
		backdropFilter: 'blur(2px)',
	},
	loaderArea: {
		position: 'relative',
		zIndex: 1,
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	donut: {
		width: 'min(132px, 30vw)',
		height: 'auto',
		animation: 'springvilleSpin 2.6s linear infinite',
		filter: 'drop-shadow(0 12px 24px rgba(24, 86, 149, 0.18))',
	},
};
