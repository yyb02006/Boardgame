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
import { rotate, slideIn } from '#styles/animations';
import useThrottleClear from '#hooks/useThrottleClear';

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
	font-size: 2vw;
	color: red;
	transform-style: preserve-3d;
	position: relative;
	border-radius: ${cardOptions.borderRadius};
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
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	border-radius: ${cardOptions.borderRadius};
	cursor: pointer;
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
	${fullWidthHeight}
	background-color: var(--bgColor-dark);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32px;
	font-size: 3rem;
	padding-bottom: 120px;
	text-align: center;
`;

const SetQuantityButton = styled.button<SetQuantityButton>`
	border-radius: 12px;
	width: max(300px, 15vw);
	cursor: pointer;
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

const ResultScreenLayout = styled.section`
	${fullWidthHeight}
	color: yellow;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-bottom: 120px;
	& > button {
		cursor: pointer;
		color: var(--color-royalBlue);
		&:hover {
			color: red;
		}
	}
`;

const Card = ({ cardId, order, isFlipped }: CardProps) => {
	const {
		setCards,
		prevCard,
		setPrevCard,
		isUnmatchedCardFlipping,
		setIsUnmatchedCardFlipping,
		flipCount,
		setFlipCount,
	} = useCardFlipperContext();
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
		if (!current || isFlipped || isUnmatchedCardFlipping || flipForwardPresence.current) return;
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

	const handleThrottledMouseMove = useCallback(throttle(onCardMove, 150), [onCardMove]);

	const onCardLeave = () => {
		const { current } = cardRef;
		if (!current || isFlipped || isUnmatchedCardFlipping || flipForwardPresence.current) return;
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
		if (!current || isFlipped || isUnmatchedCardFlipping || flipForwardPresence.current) return;
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
			<CardStyle ref={cardRef}>
				<div className="Reverse">{cardId + 1}</div>
				<div className="Forward">Front</div>
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
		gameState: { quantity },
		cards,
	} = useCardFlipperContext();
	return (
		<GameBoardLayout
			$cardLayout={quantity ? cardOptions.layoutRules[quantity] : cardOptions.layoutRules.generous}
		>
			{cards?.map((card) => {
				// console.log('executed');
				const { cardId, order, isChecked, isFlipped } = card;
				return (
					<Card
						key={`${cardId}_${order}`}
						cardId={cardId}
						order={order}
						isChecked={isChecked}
						isFlipped={isFlipped}
					/>
				);
			})}
		</GameBoardLayout>
	);
};

const ResultScreen = () => {
	const { flipCount, initializeGameData } = useCardFlipperContext();
	const flipCountRef = useRef(flipCount);
	return (
		<ResultScreenLayout>
			<div>Win!</div>
			<div>flipCount : {flipCountRef.current}</div>
			<button
				onClick={() => {
					initializeGameData();
				}}
			>
				again?
			</button>
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
