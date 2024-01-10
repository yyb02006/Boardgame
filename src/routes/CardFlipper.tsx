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
	border-radius: 16% / 10%;
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
	const box = ref.current;
	const onCardMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, clientY, currentTarget } = event;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const normalizedWidth = (clientX - left) / width + 1;
		const normalizedHeight = (clientY - top) / height + 1;
		if (box) {
			box.style.transform = `scale(${normalizedWidth},${normalizedHeight})`;
		}
	};
	const onCardLeave = (event: React.MouseEvent<HTMLDivElement>) => {
		if (box) {
			box.style.transform = `scale(1)`;
		}
	};
	return (
		<div
			onClick={() => {
				setCardState((p) => (p === 'forward' ? 'reverse' : 'forward'));
				console.log('clicked');
			}}
		>
			<CardStyle onMouseMove={onCardMove} onMouseLeave={onCardLeave} ref={ref}></CardStyle>
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
