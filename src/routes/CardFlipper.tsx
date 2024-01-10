import { capitalizeFirstLetter } from '#libs/utils';
import { throttle } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 320px;
	border-radius: 8%/5%;
	& .InnerShadow {
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 8%/5%;
		box-shadow: inset 0px 0px 24px 4px #818305;
	}
	& .OuterShadow {
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 8%/5%;
		box-shadow: 0px 0px 8px #595a01;
	}
`;

const Card = () => {
	const [cardState, setCardState] = useState<'forward' | 'reverse'>('forward');
	const ref = useRef<HTMLDivElement | null>(null);
	/**
	 *  throttle함수와 이벤트풀링으로 인해 event콜백 함수가 호출된 시점과 event가 발생한 시점이 서로 달라
	 *  currentTarget을 null로 뱉어내는 에러를 해결하기 위해서는 currentTarget을 따로 불러와야 하며 이렇게 하면
	 *  풀링으로 이벤트 객체를 재사용하지 않고 최신 currentTarget을 불러온다고 한다.(정확하지 않음)
	 * */
	const onCardMove = (
		event: React.MouseEvent<HTMLDivElement>,
		currentTarget: EventTarget & HTMLDivElement
	) => {
		const box = ref.current;
		if (!box) return;
		const { clientX, clientY } = event;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const normalizedWidth = (clientX - left) / width > 0.5 ? 20 : ((clientX - left) / width) * 40;
		const normalizedHeight = (clientY - top) / height > 0.5 ? 20 : ((clientY - top) / height) * 40;
		box.style.transition = `transform 0.15s linear`;
		box.style.transform = `rotateX(${normalizedHeight}deg) rotateY(-${normalizedWidth}deg)`;
	};
	const handleThrottledMouseMove = useRef(throttle(onCardMove, 150));
	const onCardLeave = () => {
		/* mouseLeave이후에도 지연된 호출이 작동하는 것을 방지하기 위한 쓰로틀링 타이머 캔슬 */
		handleThrottledMouseMove.current.cancel();
		const box = ref.current;
		if (!box) return;
		box.style.transition = `transform 0.5s ease`;
		box.style.transform = `rotateX(0) rotateY(0)`;
	};

	return (
		<div
			onClick={() => {
				setCardState((p) => (p === 'forward' ? 'reverse' : 'forward'));
			}}
		>
			<CardWrapper
				onMouseMove={(e) => {
					handleThrottledMouseMove.current(e, e.currentTarget);
				}}
				onMouseLeave={onCardLeave}
			>
				<div className="InnerShadow" />
				<div className="OuterShadow" />
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
