import { capitalizeFirstLetter, deepCopy, getPaddingFromOption, shuffleArray } from '#libs/utils';
import { fullWidthHeight } from '#styles/theme';
import { throttle } from 'lodash';
import React, { type ReactNode, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { CardFlipperProvider, useCardFlipperContext } from './CardFlipperContext';

const layoutOption = {
	padding: {
		lg: { top: 80, right: 120, bottom: 40, left: 120 },
		sm: { top: 80, right: 0, bottom: 40, left: 0 },
	},
};

const cardOption = {
	gap: 24,
	borderRadius: `8% / 5%`,
	layoutRules: {
		generous: { amount: 24, lg: [8, 3], md: [6, 4], sm: [4, 6] },
		standard: { amount: 18, lg: [6, 3], md: [6, 3], sm: [3, 6] },
		scant: { amount: 12, lg: [4, 3], md: [4, 3], sm: [3, 4] },
	},
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
		cursor: pointer;
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

const GameBoardLayout = styled.section<GameBoardLayoutProps>`
	position: relative;
	height: 100%;
	display: grid;
	grid-template-columns: ${(props) => `repeat(${props.$cardLayout.lg[0]}, auto)`};
	grid-template-rows: ${(props) => `repeat(${props.$cardLayout.lg[1]}, 1fr)`};
	place-content: center center;
	place-items: center center;
	gap: ${cardOption.gap}px;
	${CardWrapper} {
		/* grid가 item의 크기를 예측하게 하려면 사이즈가 명시적이어야함 (%단위 X) */
		height: calc(
			(
				${(props) => {
					const { top, bottom } = layoutOption.padding.lg;
					const {
						$cardLayout: {
							lg: [_, rows],
						},
					} = props;
					return `(100vh - ${(rows - 1) * cardOption.gap + top + bottom}px) / ${rows}`;
				}}
			)
		);
	}
	@media screen and (max-width: 1024px) {
		grid-template-columns: ${(props) => `repeat(${props.$cardLayout.md[0]}, auto)`};
		grid-template-rows: ${(props) => `repeat(${props.$cardLayout.md[1]}, 1fr)`};
	}
	@media screen and (max-width: 640px) {
		grid-template-columns: ${(props) => `repeat(${props.$cardLayout.sm[0]}, auto)`};
		grid-template-rows: ${(props) => `repeat(${props.$cardLayout.sm[1]}, 1fr)`};
	}
`;

const LobbyLayout = styled.div`
	background-color: var(--bgColor-dark);
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32px;
	position: absolute;
	transition: transform 1s ease background-color 1s ease;
	& .button {
		border-radius: 12px;
		width: 15vw;
		padding: 8px 0;
		font-size: 2rem;
		background-color: yellow;
		color: red;
		&:hover {
			background-color: violet;
		}
	}
`;

const Card = ({ children }: { children: ReactNode }) => {
	const [cardState, setCardState] = useState<'forward' | 'reverse'>('forward');
	const cardRef = useRef<{ flipable: boolean; element: { current: HTMLDivElement | null } }>({
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
		} = cardRef.current;
		if (!current || !flipable) return;
		const { clientX, clientY } = event;
		const { left, top, width, height } = currentTarget.getBoundingClientRect();
		const normalizedMouseX = (clientX - left) / width;
		const normalizedMouseY = (clientY - top) / height;
		const rotateClamp = (normalizedMouse: number) => {
			return normalizedMouse > 0.5 ? 20 : normalizedMouse * 40;
		};
		current.style.cssText = `transition: transform 0.15s linear; transform: rotateX(${rotateClamp(
			normalizedMouseY
		)}deg) rotateY(-${rotateClamp(normalizedMouseX)}deg);`;
	};
	const handleThrottledMouseMove = useRef(throttle(onCardMove, 150));
	const onCardLeave = () => {
		/* mouseLeave이후에도 지연된 호출이 작동하는 것을 방지하기 위한 쓰로틀링 타이머 캔슬 */
		handleThrottledMouseMove.current.cancel();
		const {
			element: { current },
			flipable,
		} = cardRef.current;
		if (!current || !flipable) return;
		current.style.cssText = `transition: transform 0.5s ease; transform: rotateX(0) rotateY(0);`;
	};
	const onFlip = () => {
		const card = cardRef.current;
		if (!card.element.current) return;
		card.flipable = false;
		card.element.current.style.cssText = `transition: transform 0.5s ease, transform-origin 0.5s ease; transform-origin:center; transform:rotateY(180deg);`;
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
			<CardStyle ref={cardRef.current.element}>
				<div className="Reverse">Rear</div>
				<div className="Forward">{children}</div>
			</CardStyle>
		</CardWrapper>
	);
};

const Lobby = () => {
	const { setCards, setGameState } = useCardFlipperContext();
	const { layoutRules } = cardOption;
	const getOriginalCardSets = (length: number) =>
		Array.from({ length }, (_, cardId) => ({
			cardId,
			isFliped: false,
			isSelected: false,
		}));
	const onAmountClick = (quantity: CardQuantity) => {
		const { amount } = cardOption.layoutRules[quantity];
		const cardsHalf = getOriginalCardSets(amount / 2);
		const shuffledCards = shuffleArray([...cardsHalf, ...deepCopy(cardsHalf)]);
		setCards(shuffledCards);
		setGameState({ playState: 'playing', quantity });
	};
	return (
		<LobbyLayout>
			<div>Choose the quantity of cards.</div>
			{(Object.keys(layoutRules) as CardQuantity[]).map((key, id) => {
				const { amount } = layoutRules[key];
				return (
					<button
						key={key}
						className="button"
						onClick={() => {
							onAmountClick(key);
						}}
					>{`${amount}`}</button>
				);
			})}
		</LobbyLayout>
	);
};

const GameBoard = () => {
	const {
		gameState: { quantity },
		cards,
	} = useCardFlipperContext();
	return (
		<GameBoardLayout
			$cardLayout={quantity ? cardOption.layoutRules[quantity] : cardOption.layoutRules.generous}
		>
			{cards === null ? <Lobby /> : cards.map((card, id) => <Card key={id}>{card.cardId}</Card>)}
		</GameBoardLayout>
	);
};

const CardFlipper = () => {
	return (
		<CardFlipperProvider>
			<Layout>
				<GameBoard />
			</Layout>
		</CardFlipperProvider>
	);
};

export default CardFlipper;
