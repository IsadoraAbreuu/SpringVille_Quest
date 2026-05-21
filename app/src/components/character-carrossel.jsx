import './character-carrossel.css';
import bartIdle from '../assets/images/personagens/bart.svg';
import bartActive from '../assets/images/personagens/bart2.svg';
import homerIdle from '../assets/images/personagens/homer.svg';
import homerActive from '../assets/images/personagens/homer2.svg';
import lisaIdle from '../assets/images/personagens/liza.svg';
import lisaActive from '../assets/images/personagens/liza2.svg';
import margeIdle from '../assets/images/personagens/marge.svg';
import margeActive from '../assets/images/personagens/marge2.svg';

const CHARACTER_OPTIONS = [
	{
		id: 'homer',
		name: 'Homer',
		description: 'Vai de cabeca para a aventura e encara qualquer desafio.',
		idleImage: homerIdle,
		activeImage: homerActive,
	},
	{
		id: 'marge',
		name: 'Marge',
		description: 'Mantem tudo sob controle e encontra saidas com calma.',
		idleImage: margeIdle,
		activeImage: margeActive,
	},
	{
		id: 'bart',
		name: 'Bart',
		description: 'Rapido, criativo e pronto para aprontar pelo mapa.',
		idleImage: bartIdle,
		activeImage: bartActive,
	},
	{
		id: 'lisa',
		name: 'Lisa',
		description: 'Observa tudo e desbloqueia pistas com inteligencia.',
		idleImage: lisaIdle,
		activeImage: lisaActive,
	},
];

function getWrappedIndex(index, length) {
	return (index + length) % length;
}

function getRelativePosition(index, activeIndex, length) {
	let delta = index - activeIndex;
	if (delta > length / 2) {
		delta -= length;
	}
	if (delta < -length / 2) {
		delta += length;
	}
	return delta;
}

function getPositionClass(relativePosition) {
	switch (relativePosition) {
		case 0:
			return 'character-carousel__card--center';
		case -1:
			return 'character-carousel__card--left';
		case 1:
			return 'character-carousel__card--right';
		case -2:
			return 'character-carousel__card--far-left';
		case 2:
			return 'character-carousel__card--far-right';
		default:
			return 'character-carousel__card--hidden';
	}
}

export default function CharacterCarousel({
	activeCharacterId,
	onCharacterChange,
	onPlay,
	isVisible,
}) {
	const activeIndex = Math.max(
		CHARACTER_OPTIONS.findIndex((character) => character.id === activeCharacterId),
		0,
	);
	const activeCharacter = CHARACTER_OPTIONS[activeIndex];

	const selectCharacterAtIndex = (nextIndex) => {
		onCharacterChange?.(CHARACTER_OPTIONS[getWrappedIndex(nextIndex, CHARACTER_OPTIONS.length)].id);
	};

	const showPreviousCharacter = () => {
		selectCharacterAtIndex(activeIndex - 1);
	};

	const showNextCharacter = () => {
		selectCharacterAtIndex(activeIndex + 1);
	};

	const handlePlay = () => {
		onPlay?.(activeCharacter.id);
	};

	return (
		<section
			className={`character-carousel${isVisible ? ' character-carousel--visible' : ''}`}
			aria-label="Escolha de personagem"
		>
			<div className="character-carousel__intro">
				<p className="character-carousel__eyebrow">Escolha seu personagem</p>
				<h2 className="character-carousel__title">Quem vai entrar em SpringVille?</h2>
				<p className="character-carousel__copy">
					Navegue pelo carrossel, veja cada personagem ganhar vida e comece a aventura com quem estiver no centro.
				</p>
			</div>

			<div className="character-carousel__stage">
				<div className="character-carousel__footer">
					<div className="character-carousel__summary">
						<p className="character-carousel__selected-label">Personagem ativo</p>
						<h3 className="character-carousel__selected-name">{activeCharacter.name}</h3>
						<p className="character-carousel__description">{activeCharacter.description}</p>
					</div>

					<button type="button" className="character-carousel__play" onClick={handlePlay}>
						Jogar com {activeCharacter.name}
					</button>
				</div>

				<button
					type="button"
					className="character-carousel__nav character-carousel__nav--previous"
					onClick={showPreviousCharacter}
					aria-label="Ver personagem anterior"
				>
					&lt;
				</button>

				<div className="character-carousel__track" role="list">
					{CHARACTER_OPTIONS.map((character, index) => {
						const relativePosition = getRelativePosition(index, activeIndex, CHARACTER_OPTIONS.length);
						const isCenterCharacter = relativePosition === 0;
						const positionClassName = getPositionClass(relativePosition);

						return (
							<div key={character.id} role="listitem" className={`character-carousel__slot ${positionClassName}`}>
								<button
									type="button"
									className={`character-carousel__card${isCenterCharacter ? ' character-carousel__card--selected' : ''}`}
									onClick={() => selectCharacterAtIndex(index)}
									aria-pressed={isCenterCharacter}
									aria-label={`Selecionar ${character.name}`}
								>
									<div className="character-carousel__art">
										<img
											src={character.idleImage}
											alt=""
											aria-hidden="true"
											className="character-carousel__image character-carousel__image--idle"
										/>
										<img
											src={character.activeImage}
											alt={character.name}
											className="character-carousel__image character-carousel__image--active"
										/>
									</div>
								</button>
							</div>
						);
					})}
				</div>

				<button
					type="button"
					className="character-carousel__nav character-carousel__nav--next"
					onClick={showNextCharacter}
					aria-label="Ver proximo personagem"
				>
					&gt;
				</button>
			</div>
		</section>
	);
}