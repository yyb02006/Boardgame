import { capitalizeFirstLetter, deepCopy, shuffleArray } from '#libs/utils';
import { throttle, transform } from 'lodash';
import React, { type ReactNode, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 120px 40px 120px;
	perspective: 2000px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: 80px 0 40px 0;
	}
`;

const CardCommonStyle = styled.div`
	width: 200px;
	height: 320px;
	position: relative;
	border-radius: 8% / 5%;
`;

const CardStyle = styled(CardCommonStyle)`
	transform-origin: 0% 0%;
	font-size: 3vw;
	color: red;
	transform-style: preserve-3d;
	& .Forward,
	.Reverse {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: inherit;
		backface-visibility: hidden;
		transition: filter 0.3s ease;
		display: flex;
		justify-content: center;
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

const CardWrapper = styled(CardCommonStyle)`
	display: flex;
	justify-content: center;
	align-items: center;
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

const GameBoardLayout = styled.div`
	display: grid;
	gap: 24px;
	grid-template-columns: repeat(8, minmax(200px, auto));
	place-items: center center;
	place-content: center center;
`;

const Card = ({ children }: { children: ReactNode }) => {
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
		setTimeout(() => {
			setCardState((p) => (p === 'forward' ? 'reverse' : 'forward'));
		}, 155);
	};
	return (
		<CardWrapper
			onMouseMove={(e) => {
				handleThrottledMouseMove.current(e, e.currentTarget);
			}}
			onMouseLeave={onCardLeave}
			onClick={() => {
				cardState === 'forward' && onFlip();
			}}
		>
			<div className="InnerShadow" />
			<div className="OuterShadow" />
			<CardStyle ref={ref.current.element}>
				<div className="Reverse">Rear</div>
				<div className="Forward">{children}</div>
			</CardStyle>
		</CardWrapper>
	);
};

const GameBoard = () => {
	const originalArray = Array.from({ length: 12 }, (_, cardId) => ({
		cardId,
		isFliped: false,
		isSelected: false,
	}));
	const shuffledArray = shuffleArray([...originalArray, ...deepCopy(originalArray)]);
	const [cards, setCards] = useState(shuffledArray);
	return (
		<GameBoardLayout>
			{cards.map((card, id) => (
				<Card key={id}>{card.cardId}</Card>
			))}
		</GameBoardLayout>
	);
};

const CardFlipper = () => {
	return (
		<Layout>
			<GameBoard />
		</Layout>
	);
};

export default CardFlipper;
