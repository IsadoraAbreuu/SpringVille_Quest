import './splashscreen.css';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import rosquinha from '../../assets/images/rosquinha.svg';

export default function Splashscreen({ isExiting, onRevealProgress, onExitComplete }) {
	const wrapperRef = useRef(null);
	const backgroundRef = useRef(null);
	const overlayRef = useRef(null);
	const donutRef = useRef(null);
	const onRevealProgressRef = useRef(onRevealProgress);
	const onExitCompleteRef = useRef(onExitComplete);

	useEffect(() => {
		onRevealProgressRef.current = onRevealProgress;
		onExitCompleteRef.current = onExitComplete;
	}, [onRevealProgress, onExitComplete]);

	useEffect(() => {
		if (!isExiting) {
			return undefined;
		}

		const progressState = { value: 0 };
		const context = gsap.context(() => {
			const timeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

			timeline
				.to(donutRef.current, {
					autoAlpha: 0,
					scale: 0.68,
					duration: 0.32,
				})
				.to(
					overlayRef.current,
					{
						autoAlpha: 0.14,
						duration: 0.55,
					},
					0.08,
				)
				.to(
					backgroundRef.current,
					{
						backgroundPosition: '50% 100%',
						scale: 1.04,
						duration: 1.9,
						ease: 'power3.inOut',
					},
					0.12,
				)
				.to(
					progressState,
					{
						value: 1,
						duration: 1.35,
						ease: 'power2.out',
						onUpdate: () => {
							onRevealProgressRef.current?.(progressState.value);
						},
					},
					0.62,
				)
				.to(
					wrapperRef.current,
					{
						autoAlpha: 0,
						duration: 0.38,
						ease: 'power1.out',
						onComplete: () => {
							onRevealProgressRef.current?.(1);
							onExitCompleteRef.current?.();
						},
					},
					1.58,
				);
		}, wrapperRef);

		return () => {
			context.revert();
		};
	}, [isExiting]);

	return (
		<div
			ref={wrapperRef}
			className="splashscreen"
		>
			<div ref={backgroundRef} aria-hidden="true" className="splashscreen__background" />
			<div
				ref={overlayRef}
				className="splashscreen__overlay"
			/>
			<div className="splashscreen__loader-area">
				<img
					ref={donutRef}
					src={rosquinha}
					alt="Carregando SpringVille"
					className="splashscreen__donut"
				/>
			</div>
		</div>
	);
}
