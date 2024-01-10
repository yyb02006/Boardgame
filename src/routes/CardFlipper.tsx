import { capitalizeFirstLetter } from '#libs/utils';
import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const flip = (seqDirection: 'normal' | 'reverse') => {
	return css`
		@keyframes flip_${seqDirection} {
			from {
				transform: rotate3d(0, 1, 0, 0deg);
			}
			to {
				transform: rotate3d(0, 1, 0, 180deg);
			}
		}
		animation: ${`flip_${seqDirection}`} 2s ease-in forwards ${seqDirection};
	`;
};

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 120px 40px 120px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: 80px 0 40px 0;
	}
`;

const CardStyle = styled.div`
	width: 200px;
	height: 320px;
	color: red;
	background-color: yellow;
	position: relative;
	&.Forward {
		${flip('normal')}
	}
	&.Reverse {
		${flip('reverse')}
	}
`;

const Card = () => {
	const [cardState, setCardState] = useState<'forward' | 'reverse'>('forward');
	const ref = useRef<HTMLDivElement | null>(null);
	const testRef = useRef({ clientX: 0, clientY: 0 });
	const onCardOver = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		const { clientX, clientY } = event;
		const { left, top } = event.currentTarget.getBoundingClientRect();
		const box = ref.current;
		if (box) {
			box.style.transform = `translateX(${150}px)`;
		}
		console.log();
	};
	const onCardOver2 = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};
	return (
		<div
			onClick={() => {
				setCardState((p) => (p === 'forward' ? 'reverse' : 'forward'));
				console.log('clicked');
			}}
		>
			<CardStyle onMouseMove={onCardOver} ref={ref}></CardStyle>
		</div>
	);
};

const CardFlipper = () => {
	return (
		<Layout>
			<Card></Card>
		</Layout>
	);
};

export default CardFlipper;
