import { capitalizeFirstLetter, deepCopy, getPaddingFromOption, shuffleArray } from '#libs/utils';
import { fullWidthHeight } from '#styles/theme';
import { throttle } from 'lodash';
import React, { type ReactNode, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const layoutOption = {
	padding: {
		lg: { top: 80, right: 120, bottom: 40, left: 120 },
		sm: { top: 80, right: 0, bottom: 40, left: 0 },
	},
};

const cardOption = {
	gap: 24,
	borderRadius: `8% / 5%`,
};

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: ${() => getPaddingFromOption(layoutOption.padding.lg)};
	perspective: 2000px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: ${() => getPaddingFromOption(layoutOption.padding.sm)};
	}
`;

const CardStyle = styled.div`
	${fullWidthHeight}
	transform-origin: 0% 0%;
	font-size: 3vw;
	color: red;
	transform-style: preserve-3d;
	position: relative;
	border-radius: ${cardOption.borderRadius};
	& .Forward,
	.Reverse {
		position: absolute;
		${fullWidthHeight}
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
		background-color: var(--color-royalBlue);
		color: pink;
		transform: rotateY(180deg);
	}
`;

const CardWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	border-radius: ${cardOption.borderRadius};
	aspect-ratio: 1/1.6;
	& .InnerShadow,
	.OuterShadow {
		${fullWidthHeight}
		position: absolute;
		border-radius: ${cardOption.borderRadius};
	}
	& .InnerShadow {
		box-shadow: inset 0px 0px 24px 4px #000000;
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

const GameBoardLayout = styled.div<{ $rows: number; $columns: number }>`
	height: 100%;
	display: grid;
	grid-template-columns: repeat(8, auto);
	grid-template-rows: repeat(3, minmax(0, 1fr));
	place-content: center center;
	place-items: center center;
	gap: ${cardOption.gap}px;
	${CardWrapper} {
		/* grid가 item의 크기를 예측하게 하려면 사이즈가 명시적이어야함 (%단위 X) */
		height: calc(
			(
				${(props) => {
					const { top, bottom } = layoutOption.padding.lg;
					return `(100vh - ${(props.$rows - 1) * cardOption.gap + top + bottom}px) / 3`;
				}}
			)
		);
	}
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
		<GameBoardLayout $rows={3} $columns={8}>
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
