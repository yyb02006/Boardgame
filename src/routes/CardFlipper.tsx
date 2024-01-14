import { capitalizeFirstLetter, deepCopy, getPaddingFromOption, shuffleArray } from '#libs/utils';
import { fullWidthHeight } from '#styles/theme';
import { throttle } from 'lodash';
import React, { type ReactNode, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { CardFlipperProvider, useCardFlipperContext } from './CardFlipperContext';
import { slideIn } from '#styles/animations';

const layoutOption = {
	padding: {
		lg: { top: 80, right: 120, bottom: 40, left: 120 },
		sm: { top: 80, right: 0, bottom: 40, left: 0 },
	},
};

const cardOptions: CardOption = {
	gap: 24,
	borderRadius: `8% / 5%`,
	layoutRules: {
		generous: { amount: 24, lg: [8, 3], md: [6, 4], sm: [4, 6] },
		standard: { amount: 18, lg: [6, 3], md: [6, 3], sm: [3, 6] },
		scant: { amount: 12, lg: [4, 3], md: [4, 3], sm: [3, 4] },
	},
};

const createGridAutoTemplate = (props: [number, number]) => css`
	grid-template-columns: ${`repeat(${props[0]}, auto)`};
	grid-template-rows: ${`repeat(${props[1]}, auto)`};
`;

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: ${() => getPaddingFromOption(layoutOption.padding.lg)};
	perspective: 2000px;
	overflow-y: hidden;
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
	border-radius: ${cardOptions.borderRadius};
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
	border-radius: ${cardOptions.borderRadius};
	aspect-ratio: 1/1.6;
	& .InnerShadow,
	.OuterShadow {
		${fullWidthHeight}
		position: absolute;
		border-radius: ${cardOptions.borderRadius};
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
	${(props) => createGridAutoTemplate(props.$cardLayout.lg)}
	place-content: center center;
	place-items: center center;
	gap: 24px;
	${CardWrapper} {
		width: 8vw;
	}
	@media screen and (max-width: 1024px) {
		${(props) => createGridAutoTemplate(props.$cardLayout.md)}
		gap: 18px;
	}
	@media screen and (max-width: 640px) {
		${(props) => createGridAutoTemplate(props.$cardLayout.sm)}
		gap: 12px;
	}
`;

const TitleWord = styled.div<SetQuantityButton>`
	display: inline-block;
	${(props) =>
		props.$isRun &&
		slideIn({
			direction: 'vertical',
			distance: 900,
			duration: 0.35,
			name: `drop`,
			seqDirection: 'reverse',
			isFaded: false,
			delay: 0.25,
		})}
	& .Inner {
		display: inline-block;
		${(props) => css`
			@keyframes shake_title_${props.$index} {
				from {
					transform: rotate(0);
				}
				to {
					transform: ${props.$index % 2 === 1 ? 'rotate(50deg)' : 'rotate(-50deg)'};
				}
			}
		`}
		${(props) =>
			props.$isRun && `animation: shake_title_${props.$index} 0.35s 0.25s ease-in forwards;`};
	}
`;

const LobbyLayout = styled.div`
	${fullWidthHeight}
	background-color: var(--bgColor-dark);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32px;
	position: absolute;
	font-size: 3rem;
	padding-bottom: 120px;
	text-align: center;
`;

const SetQuantityButton = styled.button<SetQuantityButton>`
	border-radius: 12px;
	width: max(300px, 15vw);
	${(props) =>
		props.$isRun &&
		slideIn({
			direction: 'vertical',
			distance: 800,
			duration: 0.45,
			name: `drop`,
			seqDirection: 'reverse',
			isFaded: false,
			delay: (3 - props.$index) / 20,
		})}
	& .Inner {
		${fullWidthHeight}
		border-radius: 12px;
		padding: 8px 0;
		font-size: 0.7em;
		background-color: yellow;
		color: red;
		${(props) => css`
			@keyframes shake_button_${props.$index} {
				from {
					transform: rotate(0);
				}
				to {
					transform: ${props.$index === 1 ? 'rotate(50deg)' : 'rotate(-50deg)'};
				}
			}
		`}
		${(props) =>
			props.$isRun &&
			`animation: shake_button_${props.$index} 0.45s ${(3 - props.$index) / 20}s ease-in forwards;`}
		transition:
		background-color 0.2s ease,
		color 0.2s ease;
		&:hover {
			background-color: var(--color-royalBlue);
			color: violet;
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
	const {
		setCards,
		setGameState,
		gameState: { playState },
	} = useCardFlipperContext();
	const { layoutRules } = cardOptions;
	const getOriginalCardSets = (length: number) =>
		Array.from({ length }, (_, cardId) => ({
			cardId,
			isFliped: false,
			isSelected: false,
		}));
	const onAmountClick = (quantity: CardQuantity) => {
		const { amount } = cardOptions.layoutRules[quantity];
		const cardsHalf = getOriginalCardSets(amount / 2);
		const shuffledCards = shuffleArray([...cardsHalf, ...deepCopy(cardsHalf)]);
		setCards(shuffledCards);
		setGameState({ playState: 'playing', quantity });
	};
	return (
		<LobbyLayout>
			<div className="Title">
				{'Choose the quantity of cards.'.split(' ').map((word, id, source) => (
					<TitleWord key={word} $index={id} $isRun={playState === 'playing'}>
						<span className="Inner">{word}</span>
						{id < source.length - 1 && <span>&nbsp;</span>}
					</TitleWord>
				))}
			</div>
			{(Object.keys(layoutRules) as CardQuantity[]).map((key, id) => {
				const { amount } = layoutRules[key];
				return (
					<SetQuantityButton
						key={key}
						$index={id}
						$isRun={playState === 'playing'}
						onClick={() => {
							onAmountClick(key);
						}}
					>
						<div className="Inner">{`${amount}`}</div>
					</SetQuantityButton>
				);
			})}
		</LobbyLayout>
	);
};

const GameBoard = () => {
	const {
		gameState: { quantity, playState },
		cards,
		lazyPlayState,
	} = useCardFlipperContext();
	return (
		<GameBoardLayout
			$cardLayout={quantity ? cardOptions.layoutRules[quantity] : cardOptions.layoutRules.generous}
		>
			{playState === 'ready' || lazyPlayState === 'ready' || cards === null ? (
				<Lobby />
			) : (
				cards.map((card, id) => <Card key={id}>{card.cardId}</Card>)
			)}
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
