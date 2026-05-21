import './game-intro.css';
import { useState } from 'react';

const INTRO_STEPS = [
	{
		id: 'explore',
		title: 'Explore SpringVille',
		text: 'Passe pelos cenarios, descubra pistas e avance pelas areas mais importantes da cidade.',
		accent: 'Mapa e descoberta',
	},
	{
		id: 'missions',
		title: 'Complete os desafios',
		text: 'Cada parada da aventura traz pequenas missoes e interacoes para desbloquear o proximo passo.',
		accent: 'Missao em andamento',
	},
	{
		id: 'character',
		title: 'Escolha quem vai jogar',
		text: 'Depois das instrucoes, selecione seu personagem favorito para comecar a jornada.',
		accent: 'Tudo pronto',
	},
];

export default function GameIntro({ isVisible, onFinish }) {
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const currentStep = INTRO_STEPS[currentStepIndex];
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === INTRO_STEPS.length - 1;

	const goToPreviousStep = () => {
		setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
	};

	const goToNextStep = () => {
		setCurrentStepIndex((prev) => Math.min(prev + 1, INTRO_STEPS.length - 1));
	};

	const handleFinish = () => {
		onFinish?.();
	};

	return (
		<section className={`game-intro${isVisible ? ' game-intro--visible' : ''}`} aria-label="Introducao do jogo">
			<div className="game-intro__balloon">
				<p className="game-intro__accent">{currentStep.accent}</p>
				<h2 className="game-intro__title">{currentStep.title}</h2>
				<p className="game-intro__text">{currentStep.text}</p>

				<div className="game-intro__footer">
					<div className="game-intro__progress" aria-label={`Passo ${currentStepIndex + 1} de ${INTRO_STEPS.length}`}>
						{INTRO_STEPS.map((step, index) => (
							<span
								key={step.id}
								className={`game-intro__dot${index === currentStepIndex ? ' game-intro__dot--active' : ''}`}
							/>
						))}
					</div>

					<div className="game-intro__actions">
						<button
							type="button"
							className="game-intro__button game-intro__button--ghost"
							onClick={goToPreviousStep}
							disabled={isFirstStep}
						>
							Anterior
						</button>

						{isLastStep ? (
							<button type="button" className="game-intro__button game-intro__button--primary" onClick={handleFinish}>
								Entendido
							</button>
						) : (
							<button type="button" className="game-intro__button game-intro__button--primary" onClick={goToNextStep}>
								Proximo
							</button>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}