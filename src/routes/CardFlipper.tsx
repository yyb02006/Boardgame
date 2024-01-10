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
	border-radius: 8% / 5%;
	transform-origin: 0% 0%;
	&.Forward {
		${flip('normal')}
	}
	&.Reverse {
		${flip('reverse')}
	}
`;

const CardWrapper = styled.div`
	width: 200px;
	height: 320px;
`;

const Card = () => {
	const [cardState, setCardState] = useState<'forward' | 'reverse'>('forward');
	const ref = useRef<HTMLDivElement | null>(null);
	const onCardMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const box = ref.current;
		const { clientX, clientY, currentTarget } = event;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const normalizedWidth = ((clientX - left) / width) * 20;
		const normalizedHeight = ((clientY - top) / height) * 20;
		if (box) {
			box.style.transition = `transform 0.2s linear`;
			box.style.transform = `rotateX(${normalizedHeight}deg) rotateY(-${normalizedWidth}deg)`;
		}
	};
	const onCardLeave = () => {
		const box = ref.current;
		if (box) {
			box.style.transition = `transform 0.5s ease`;
			box.style.transform = `rotateX(0) rotateY(0)`;
		}
	};
	return (
		<div
			onClick={() => {
				setCardState((p) => (p === 'forward' ? 'reverse' : 'forward'));
			}}
		>
			<CardWrapper onMouseMove={onCardMove} onMouseLeave={onCardLeave}>
				<CardStyle ref={ref}>Card</CardStyle>
			</CardWrapper>
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
