import { capitalizeFirstLetter, deepCopy, getPaddingFromOption, shuffleArray } from '#libs/utils';
import { fullWidthHeight } from '#styles/theme';
import { setWith, throttle } from 'lodash';
import React, {
	type ReactNode,
	useRef,
	useState,
	useContext,
	useEffect,
	useCallback,
	useLayoutEffect,
} from 'react';
import styled, { css } from 'styled-components';
import { CardFlipperProvider, useCardFlipperContext } from './CardFlipperContext';
import { fadeInZ, rotate, slideIn } from '#styles/animations';
import useThrottleClear from '#hooks/useThrottleClear';

const layoutOption = {
	padding: {
		lg: { top: 80, right: 120, bottom: 20, left: 120 },
		md: { top: 80, right: 0, bottom: 20, left: 0 },
		sm: { top: 60, right: 0, bottom: 20, left: 0 },
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
	min-height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: ${() => getPaddingFromOption(layoutOption.padding.lg)};
	perspective: 2000px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: ${() => getPaddingFromOption(layoutOption.padding.md)};
	}
	@media screen and (max-width: 640px) {
		display: flex;
		flex-direction: column;
		padding: ${() => getPaddingFromOption(layoutOption.padding.sm)};
	}
	& .calcMinHeight {
		min-height: ${() => {
			const { top, bottom } = layoutOption.padding.lg;
			return `calc(100vh - ${top + bottom}px)`;
		}};
	}
	& .calcHeight {
		height: ${() => {
			const { top, bottom } = layoutOption.padding.lg;
			return `calc(100vh - ${top + bottom}px)`;
		}};
	}
`;

const CardStyle = styled.div<CardStyleProps>`
	${fullWidthHeight}
	transform-origin: 0% 0%;
	font-size: 2vw;
	color: red;
	transform-style: preserve-3d;
	position: relative;
	border-radius: ${cardOptions.borderRadius};
	&.Init {
		opacity: 0;
		${(props) =>
			fadeInZ({
				name: `card${props.$index}`,
				distance: 400,
				duration: 0.3,
				seqDirection: 'normal',
				delay: 1,
			})}
	}
	& .Forward,
	.Reverse {
		${fullWidthHeight}
		position: absolute;
		border-radius: inherit;
		backface-visibility: hidden;
		transition: filter 0.3s ease;
		display: flex;
		justify-content: center;
		align-items: center;
		user-select: none;
	}
	& .Forward {
		background-color: yellow;
	}
	& .Reverse {
		font-size: 1.5em;
		background-color: var(--color-royalBlue);
		color: pink;
		transform: rotateY(180deg);
		cursor: default;
	}
`;

const CardWrapper = styled.div`
	width: 7vw;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	border-radius: ${cardOptions.borderRadius};
	cursor: pointer;
	aspect-ratio: 1/1.5;
	& .InnerShadow,
	.OuterShadow {
		${fullWidthHeight}
		position: absolute;
		border-radius: ${cardOptions.borderRadius};
	}
	& .InnerShadow {
		box-shadow: inset 0 0 24px 4px #000000;
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
	@media screen and (max-width: 1024px) {
		width: 13vw;
	}
	@media screen and (max-width: 640px) {
		width: 16vw;
	}
`;

const ScoreBoard = styled.section`
	background-color: #181818;
	font-size: 2rem;
	font-weight: 500;
	padding: 12px 48px;
	display: flex;
	align-items: center;
	margin-bottom: 24px;
	box-shadow: inset 0 0 16px 2px #000000;
	border-radius: 24px;
	& > div {
		flex: 1 1;
		display: flex;
	}
	& > div:nth-child(2) {
		justify-content: center;
	}
	& > div:nth-child(3) {
		justify-content: right;
		color: yellow;
		font-weight: 800;
	}
	@media screen and (max-width: 1024px) {
		height: 9vw;
		font-size: 3.5vw;
		padding: 0 48px;
		box-shadow: inset 0 0 1.5vw 2px #000000;
		border-radius: 0;
	}
`;

const CardTable = styled.section<CardTableProps>`
	position: relative;
	display: grid;
	${(props) => createGridAutoTemplate(props.$cardLayout.lg)}
	place-content: center center;
	place-items: center center;
	gap: min(2.2vw, 24px);
	@media screen and (max-width: 1024px) {
		${(props) => createGridAutoTemplate(props.$cardLayout.md)}
		gap: 18px;
	}
	@media screen and (max-width: 640px) {
		${(props) => createGridAutoTemplate(props.$cardLayout.sm)}
		gap: 16px;
	}
`;

const GameBoardLayout = styled.section`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	${CardTable} {
		flex: 1 1;
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
		${(props) =>
			props.$isRun &&
			rotate({
				name: 'letter',
				duration: 0.4,
				delay: 0.2,
				degree: props.$index % 2 === 1 ? 50 : -50,
				timingFunc: 'ease-in',
			})}
	}
`;

const LobbyLayout = styled.section`
	height: calc(100vh - 100px);
	background-color: var(--bgColor-dark);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32px;
	font-size: 3rem;
	padding-bottom: 120px;
	text-align: center;
	overflow-y: hidden;
	> .Title {
		${fadeInZ({
			name: 'quantity',
			distance: 400,
			duration: 0.3,
			seqDirection: 'normal',
			delay: 0,
		})}
	}
`;

const SetQuantityButton = styled.button<SetQuantityButton>`
	border-radius: 12px;
	width: max(300px, 15vw);
	opacity: 0;
	cursor: pointer;
	${(props) => css`
		${fadeInZ({
			name: 'quantity',
			distance: 400,
			duration: 0.3,
			seqDirection: 'normal',
			delay: (props.$index + 1) * 0.2,
		})}
	`}
	${(props) =>
		props.$isRun &&
		css`
			opacity: 1;
			${slideIn({
				direction: 'vertical',
				distance: 800,
				duration: 0.45,
				name: `drop`,
				seqDirection: 'reverse',
				isFaded: false,
				delay: (3 - props.$index) / 20,
			})}
		`}
	& .Inner {
		${fullWidthHeight}
		border-radius: 12px;
		padding: 8px 0;
		font-size: 0.7em;
		background-color: yellow;
		color: red;
		${(props) =>
			props.$isRun &&
			rotate({
				name: 'button',
				duration: 0.45,
				delay: (3 - props.$index) / 20,
				degree: props.$index % 2 === 1 ? 50 : -50,
				timingFunc: 'ease-in',
			})}
		transition:
		background-color 0.2s ease,
		color 0.2s ease;
		&:hover {
			background-color: var(--color-royalBlue);
			color: violet;
		}
	}
`;

const ResultText = styled.div<ResultTextProps>`
	& > button {
		cursor: pointer;
		color: var(--color-royalBlue);
		&:hover {
			color: red;
		}
	}
	&.Enter {
		opacity: 0;
		${(props) =>
			slideIn({
				direction: 'vertical',
				distance: -100,
				duration: 0.2,
				name: 'textEnter',
				seqDirection: 'normal',
				delay: props.$delay,
			})};
	}
	&.Exit {
		${(props) =>
			slideIn({
				direction: 'vertical',
				distance: -100,
				duration: 0.2,
				name: 'textExit',
				seqDirection: 'reverse',
				delay: 0.4 - props.$delay,
			})};
	}
`;

const ResultScreenLayout = styled.section`
	color: yellow;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 120px;
`;

const Card = ({ index, cardId, order, isFlipped }: CardProps) => {
	const {
		setCards,
		prevCard,
		setPrevCard,
		isUnmatchedCardFlipping,
		setIsUnmatchedCardFlipping,
		flipCount,
		setFlipCount,
	} = useCardFlipperContext();
	const [cardState, setCardState] = useState<CardState>('init');
	const flipForwardPresence = useRef(false);
	const cardRef = useRef<HTMLDivElement | null>(null);
	/* 
	element.current까지 구조분해 해버리면 current의 원시값이 null일때,
	더 이상 cardRef.current.element.current를 참조하지 않게 됨
	*/
	const onCardMove = (
		event: React.MouseEvent<HTMLDivElement>,
		currentTarget: EventTarget & HTMLDivElement
	) => {
		const { current } = cardRef;
		if (
			!current ||
			isFlipped ||
			isUnmatchedCardFlipping ||
			flipForwardPresence.current ||
			cardState === 'init'
		)
			return;
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

	useEffect(() => {
		const timeout = setTimeout(() => {
			setCardState('available');
		}, index * 100);
		return () => {
			clearTimeout(timeout);
		};
	}, [index]);

	const handleThrottledMouseMove = useCallback(throttle(onCardMove, 150), [onCardMove]);

	const onCardLeave = () => {
		const { current } = cardRef;
		if (
			!current ||
			isFlipped ||
			isUnmatchedCardFlipping ||
			flipForwardPresence.current ||
			cardState === 'init'
		)
			return;
		handleThrottledMouseMove.cancel();
		current.style.cssText = `transition: transform 0.5s ease; transform: rotateX(0) rotateY(0);`;
	};

	const flip = <T extends HTMLElement>(card: T | null, direction: 'forward' | 'reverse') => {
		if (!card) return;
		card.style.cssText = `transition: transform 0.5s ease, transform-origin 0.5s ease; transform-origin:center; transform:rotateY(${
			direction === 'forward' ? 0 : 180
		}deg);`;
		if (direction === 'forward') {
			flipForwardPresence.current = true;
			setTimeout(() => {
				handleThrottledMouseMove.cancel();
				flipForwardPresence.current = false;
			}, 500);
		}
	};

	const onCardClick = () => {
		const { current } = cardRef;
		if (
			!current ||
			isFlipped ||
			isUnmatchedCardFlipping ||
			flipForwardPresence.current ||
			cardState === 'init'
		)
			return;
		handleThrottledMouseMove.cancel();
		const [prevId] = prevCard;
		setCards((p) => {
			if (p === null) return null;
			return p.map((arr) =>
				arr.cardId === cardId && arr.order === order ? { ...arr, isFlipped: true } : arr
			);
		});
		setFlipCount((p) => p + 1);
		if (prevCard.length > 0) {
			if (prevId === cardId) {
				setCards((p) => {
					if (p === null) return null;
					return p.map((arr) => (arr.cardId === cardId ? { ...arr, isChecked: true } : arr));
				});
			} else {
				setIsUnmatchedCardFlipping(true);
				setTimeout(() => {
					setCards((p) => {
						if (p === null) return null;
						return p.map((arr) =>
							arr.cardId === cardId || arr.cardId === prevId ? { ...arr, isFlipped: false } : arr
						);
					});
					setIsUnmatchedCardFlipping(false);
				}, 500);
			}
			setPrevCard([]);
		} else {
			setPrevCard([cardId]);
		}
	};

	useEffect(() => {
		if (flipCount) {
			isFlipped
				? flip<HTMLDivElement>(cardRef.current, 'reverse')
				: flip<HTMLDivElement>(cardRef.current, 'forward');
		}
	}, [isFlipped]);

	useThrottleClear(handleThrottledMouseMove, [onCardMove]);
	return (
		<CardWrapper
			onMouseMove={(e) => {
				/*
				throttle함수를 사용할 때 이벤트풀링으로 인해 event콜백 함수가 호출된 시점과 event가 발생한 시점이 서로 달라
				event.currentTarget을 null로 뱉어내는 에러를 해결하기 위해서는 currentTarget을 따로 불러와야 하며 이렇게 하면
				풀링으로 이벤트 객체를 재사용하지 않고 최신 currentTarget을 불러온다고 한다.(정확하지 않음)
				*/
				handleThrottledMouseMove(e, e.currentTarget);
			}}
			onMouseLeave={onCardLeave}
			onClick={onCardClick}
		>
			<div className="InnerShadow" />
			<div className="OuterShadow" />
			<CardStyle ref={cardRef} className={capitalizeFirstLetter(cardState)} $index={index * 0.1}>
				<div className="Reverse">{cardId + 1}</div>
				<div className="Forward"></div>
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
	const getOriginalCardSets = (length: number): Card[] =>
		Array.from({ length }, (_, cardId) => ({
			cardId,
			order: 1,
			isChecked: false,
			isFlipped: false,
		}));
	const onAmountClick = (quantity: CardQuantity) => {
		const { amount } = cardOptions.layoutRules[quantity];
		const cardsHalf = getOriginalCardSets(amount / 2);
		const shuffledCards = shuffleArray([
			...cardsHalf,
			...deepCopy(cardsHalf).map((arr) => ({ ...arr, order: 2 }) satisfies Card),
		]);
		setCards(shuffledCards);
		setGameState({ playState: 'playing', quantity });
	};
	return (
		<LobbyLayout className="calcHeight">
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
		gameState: { quantity },
		cards,
		flipCount,
	} = useCardFlipperContext();
	return (
		<GameBoardLayout className="calcMinHeight">
			<ScoreBoard>
				<div>Remains : {cards?.filter((arr) => !arr.isChecked).length}</div>
				<div>Attempts : {flipCount}</div>
				<div>30</div>
			</ScoreBoard>
			<CardTable
				$cardLayout={
					quantity ? cardOptions.layoutRules[quantity] : cardOptions.layoutRules.generous
				}
			>
				{cards?.map((card, id) => {
					// console.log('executed');
					const { cardId, order, isChecked, isFlipped } = card;
					return (
						<Card
							key={`${cardId}_${order}`}
							index={id}
							cardId={cardId}
							order={order}
							isChecked={isChecked}
							isFlipped={isFlipped}
						/>
					);
				})}
			</CardTable>
		</GameBoardLayout>
	);
};

const ResultScreen = () => {
	const { flipCount, initializeGameData } = useCardFlipperContext();
	const flipCountRef = useRef(flipCount);
	const [motionClass, setMotionClass] = useState<'Enter' | 'Exit'>('Enter');
	return (
		<ResultScreenLayout className="calcHeight">
			<ResultText $delay={0} className={motionClass}>
				Win!
			</ResultText>
			<ResultText $delay={0.2} className={motionClass}>
				flipCount : {flipCountRef.current}
			</ResultText>
			<ResultText $delay={0.4} className={motionClass}>
				<button
					onClick={() => {
						initializeGameData();
						setMotionClass('Exit');
					}}
				>
					again?
				</button>
			</ResultText>
		</ResultScreenLayout>
	);
};

const GameContainer = () => {
	const { cards, setGameState, flipCount, lazyPlayState } = useCardFlipperContext();
	useLayoutEffect(() => {
		cards?.some((arr) => !arr.isChecked) === false &&
			setGameState((p) => ({ ...p, playState: 'win' }));
	}, [flipCount]);
	// console.log('Container Rendered');
	switch (lazyPlayState) {
		case 'ready':
			return <Lobby />;
		case 'playing':
			return <GameBoard />;
		case 'win':
			return <ResultScreen />;
		default:
			return null;
	}
};

const CardFlipper = () => {
	return (
		<CardFlipperProvider>
			<Layout>
				<GameContainer />
			</Layout>
		</CardFlipperProvider>
	);
};

export default CardFlipper;
