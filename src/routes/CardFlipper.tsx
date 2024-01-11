import { capitalizeFirstLetter } from '#libs/utils';
import { throttle, transform } from 'lodash';
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
		transform-origin: center;
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
	display: flex;
	justify-content: center;
	font-size: 3vw;
	transform-style: preserve-3d;
	& .Forward,
	.Reverse {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 8% / 5%;
		backface-visibility: hidden;
		transition: filter 0.3s ease;
	}
	& .Forward {
		background-color: yellow;
	}
	& .Reverse {
		background-color: #4444dd;
		color: pink;
		transform: rotateY(180deg);
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
	perspective: 2000px;
	& .InnerShadow {
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 8%/5%;
		box-shadow: inset 0px 0px 24px 4px #000000;
	}
	& .OuterShadow {
		width: 100%;
		height: 100%;
		position: absolute;
		border-radius: 8%/5%;
	}
	&:hover {
		& .OuterShadow {
			box-shadow: 0px 0px 2px #000000;
		}
		& .Forward {
			filter: drop-shadow(0px 0px 12px yellow);
		}
		& .Reverse {
			filter: drop-shadow(0px 0px 12px #4444dd);
		}
	}
`;

const Card = () => {
	const [cardState, setCardState] = useState<'forward' | 'reverse'>('forward');
	const ref = useRef<{ flipable: boolean; element: { current: HTMLDivElement | null } }>({
		flipable: true,
		element: { current: null },
	});
	/**
	 *  throttle함수와 이벤트풀링으로 인해 event콜백 함수가 호출된 시점과 event가 발생한 시점이 서로 달라
	 *  currentTarget을 null로 뱉어내는 에러를 해결하기 위해서는 currentTarget을 따로 불러와야 하며 이렇게 하면
	 *  풀링으로 이벤트 객체를 재사용하지 않고 최신 currentTarget을 불러온다고 한다.(정확하지 않음)
	 * */
	const onCardMove = (
		event: React.MouseEvent<HTMLDivElement>,
		currentTarget: EventTarget & HTMLDivElement
	) => {
		const {
			element: { current },
			flipable,
		} = ref.current;
		if (!current || !flipable) return;
		const { clientX, clientY } = event;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const normalizedWidth = (clientX - left) / width > 0.5 ? 20 : ((clientX - left) / width) * 40;
		const normalizedHeight = (clientY - top) / height > 0.5 ? 20 : ((clientY - top) / height) * 40;
		current.style.transition = `transform 0.15s linear`;
		current.style.transform = `rotateX(${normalizedHeight}deg) rotateY(-${normalizedWidth}deg)`;
	};
	const handleThrottledMouseMove = useRef(throttle(onCardMove, 150));
	const onCardLeave = () => {
		/* mouseLeave이후에도 지연된 호출이 작동하는 것을 방지하기 위한 쓰로틀링 타이머 캔슬 */
		handleThrottledMouseMove.current.cancel();
		const {
			element: { current },
			flipable,
		} = ref.current;
		if (!current || !flipable) return;
		current.style.transition = `transform 0.5s ease`;
		current.style.transform = `rotateX(0) rotateY(0)`;
	};
	const onFlip = () => {
		const box = ref.current;
		if (!box.element.current) return;
		box.flipable = false;
		box.element.current.style.transition = `transform 0.5s ease, transform-origin 0.5s ease`;
		box.element.current.style.transformOrigin = `center`;
		box.element.current.style.transform = `rotateY(180deg)`;
	};
	return (
		<CardWrapper
			onMouseMove={(e) => {
				handleThrottledMouseMove.current(e, e.currentTarget);
			}}
			onMouseLeave={onCardLeave}
			onClick={() => {
				onFlip();
			}}
		>
			<div className="InnerShadow" />
			<div className="OuterShadow" />
			<CardStyle ref={ref.current.element}>
				<div className="Reverse">Rear</div>
				<div className="Forward">Front</div>
			</CardStyle>
		</CardWrapper>
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
