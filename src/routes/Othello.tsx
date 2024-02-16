import useLazyState from '#hooks/useLazyState';
import { capitalizeFirstLetter, getFlippables, getFlippeds, getOppositeElement } from '#libs/utils';
import { colorBlink, slideIn } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { resultTransition } from './Home';

const OthelloColors = {
	player1: { activated: '#e9a71a', flippable: '#9c937f' },
	player2: { activated: 'var(--color-royalBlue)', flippable: '#9b9bbb' },
	common: '#505050',
};

const Layout = styled.section`
	height: 45vw;
	width: 100%;
	padding: 80px 120px 40px 120px;
	display: flex;
	font-size: 5rem;
	font-weight: 800;
	justify-content: space-between;
	position: relative;
	@media screen and (max-width: 1024px) {
		height: 100vh;
		flex-direction: column;
		align-items: center;
		padding: 80px 0 40px 0;
	}
`;

const GameBoardWrapper = styled.section`
	height: 100%;
	position: relative;
	aspect-ratio: 1;
`;

const PlayerCardLayout = styled.section<PlayerCardLayoutProps>`
	max-width: 400px;
	width: 100%;
	background-color: ${(props) => {
		const { $currentPlayer, $player, $playState } = props;
		if ($playState === 'playing') {
			return $currentPlayer === $player
				? OthelloColors[props.$player].activated
				: OthelloColors.common;
		} else {
			return OthelloColors[props.$player].activated;
		}
	}};
	margin: ${(props) => (props.$player === 'player1' ? '0 4vw 0 0' : '0 0 0 4vw')};
	font-size: 4vw;
	position: relative;
	padding: 12px 24px;
	h3 {
		font-size: ${`clamp(1rem,2vw,2rem)`};
		font-weight: 600;
		margin: 0;
	}
	& .Error {
		font-size: ${`clamp(0.5rem,1vw,1rem)`};
		color: #ff481b;
	}
	& .Timer {
		${fullWidthHeight}
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 0;
		left: 0;
		font-weight: 800;
		> .Seconds {
			font-size: 8rem;
		}
		> .Passed {
			font-size: 4rem;
		}
	}
	@media screen and (max-width: 1024px) {
		margin: ${(props) => (props.$player === 'player1' ? '0 0 20px 0' : '20px 0 0 0 ')};
		max-width: 100%;
		overflow: visible;
		h3 {
			font-size: 4vw;
		}
		> .Wrapper {
			display: flex;
			justify-content: space-between;
		}
		& .Error {
			position: absolute;
			&::after {
				content: 'fake';
				background-color: red;
			}
		}
		& .Timer {
			width: auto;
			height: auto;
			position: relative;
			> .Seconds {
				position: absolute;
				font-size: 2rem;
				right: 0;
			}
			> .Passed {
				position: absolute;
				font-size: 2rem;
				right: 0;
			}
		}
		& .FakeLetter {
			color: transparent;
			user-select: none;
		}
	}
`;

const LobbyAndResult = styled.div`
	${fullWidthHeight}
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 80px;
	top: 0;
	left: 0;
`;

const LobbyCover = styled.div<LobbyCoverProps>`
	position: absolute;
	${(props) => {
		const { $index } = props;
		return css`
			${$index === 0 || $index === 3
				? `left:0; background-color:${OthelloColors.player1.activated};`
				: `right:0; background-color:${OthelloColors.player2.activated};`};
			${$index === 0 || $index === 1 ? 'top:0;' : 'bottom:0;'};
			${$index === 0 || $index === 2 ? 'height:60%; width:50%;' : 'height:50%; width:60%;'}
		`;
	}}
	${(props) => {
		const { $winner, $direction, $playState } = props;
		if ($playState === 'playing') {
			return resultTransition.spinAndZoom({
				name: 'lobby',
				seqDirection: 'reverse',
				aniDirection: props.$direction,
			});
		} else if ($playState === 'decided') {
			switch ($winner) {
				case 'player1':
				case 'player2':
					return css`
						background-color: ${OthelloColors[$winner].activated};
						${resultTransition.slideInFromSide({
							winner: $winner,
							seqDirection: 'normal',
							aniDirection: $winner === 'player1' ? 'left' : 'right',
						})}
					`;
				case 'draw':
					return resultTransition.spinAndZoom({
						name: 'draw',
						seqDirection: 'normal',
						aniDirection: $direction,
					});
				default:
					return null;
			}
		}
	}}
`;

const LobbyLayout = styled(LobbyAndResult)<LobbyLayoutProps>`
	position: absolute;
	overflow: hidden;
	& .Button {
		${(props) =>
			props.$onSlideIn
				? slideIn({
						name: 'lobby',
						seqDirection: 'reverse',
						distance: -200,
						direction: 'vertical',
						duration: 500,
				  })
				: slideIn({
						name: 'lobby',
						seqDirection: 'normal',
						distance: -200,
						direction: 'vertical',
						duration: 500,
				  })}
	}
`;

const GameBoardLayout = styled.div`
	aspect-ratio: 1;
	display: grid;
	gap: 8px;
	grid-template-columns: repeat(8, auto);
	grid-template-rows: repeat(8, auto);
`;

const SquareStyle = styled.div<SquareStyleProps>`
	${fullWidthHeight}
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 800;
	position: relative;
	transform-style: preserve-3d;
	&.Back {
		transform: perspective(1000px) rotateY(180deg);
	}
	&.Front {
		transform: perspective(1000px) rotateY(0);
	}
	& .Forward,
	& .Reverse {
		${fullWidthHeight}
		position: absolute;
		backface-visibility: hidden;
		border-radius: 100%;
	}
	& .Forward {
		background-color: ${(props) =>
			props.$initPlayer === 'player1'
				? OthelloColors.player1.activated
				: OthelloColors.player2.activated};
	}
	& .Reverse {
		transform: rotateY(180deg);
		background-color: ${(props) =>
			props.$initPlayer === 'player1'
				? OthelloColors.player2.activated
				: OthelloColors.player1.activated};
	}
`;

const SquareLayout = styled.div<Omit<SquareStyleProps, '$isHovered'>>`
	border-radius: 100%;
	position: relative;
	cursor: pointer;
	${(props) => {
		const { $flippable, $currentPlayer, $owner } = props;
		if ($owner === 'unowned') {
			switch ($flippable) {
				case true:
					return colorBlink({
						name: 'square',
						startColor: OthelloColors.common,
						alternateColor: OthelloColors[$currentPlayer].flippable,
						duration: 700,
						targetProperty: 'backgroundColor',
					});
				default:
					return css`
						background-color: ${OthelloColors.common};
					`;
			}
		} else {
			return css`
				background-color: transparent;
			`;
		}
	}}
	&.Hover {
		> ${SquareStyle} {
			z-index: 1;
			background-color: ${(props) => {
				const { $owner, $currentPlayer } = props;
				switch ($owner) {
					case 'unowned':
						return OthelloColors[$currentPlayer].activated;
					default:
						return OthelloColors.common;
				}
			}};
			transform: perspective(1000px) translateZ(200px)
				${(props) =>
					props.$initPlayer === props.$currentPlayer || props.$initPlayer === 'unowned'
						? null
						: 'rotateY(180deg)'};
		}
		& .Shadow {
			z-index: 1;
			transform: perspective(1000px) translateZ(200px)
				${(props) =>
					props.$initPlayer === props.$currentPlayer || props.$initPlayer === 'unowned'
						? null
						: 'rotateY(180deg)'};
		}
	}
	> ${SquareStyle}, .Shadow {
		transition:
			transform 400ms ease,
			background-color 400ms ease;
	}
	& .Shadow {
		${fullWidthHeight}
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		box-shadow: 0 0 16px #101010;
		border-radius: 100%;
		transform: perspective(1000px);
		transform-style: preserve-3d;
	}
`;

const Square = ({
	currentSquare,
	currentPlayer,
	squareStates,
	playerData,
	updateStates,
	setPlayersData,
}: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const { index, initPlayer, isFlipped, owner, flippable, isPrev } = currentSquare;
	const onSquareClickHandler = () => {
		const opponentPlayer = getOppositeElement(currentPlayer);
		const updateError = (error: string) => {
			setPlayersData((p) => ({
				...p,
				[currentPlayer]: {
					...p[currentPlayer],
					error,
				},
			}));
		};
		const shouldAbort = () => {
			const abortTakeOver =
				owner === opponentPlayer && playerData[currentPlayer].takeOverChance === 0;
			return !flippable || owner === currentPlayer || abortTakeOver;
		};
		if (shouldAbort()) {
			return;
		} else if (
			owner === opponentPlayer &&
			squareStates.filter((square) => square.owner === currentPlayer).length < 8 &&
			playerData[currentPlayer].hasFlippable
		) {
			updateError('cannot takeover until the own squares reaches 8.');
			return;
		} else if (isPrev) {
			updateError('cannot change the recently modified square again.');
			return;
		}
		const isCurrentSquare = (currentIndex: number) => currentIndex === index;
		const flippeds = getFlippeds(index, squareStates, currentPlayer);
		const flippedSquares = squareStates.map((square) => {
			const matchedSquare = flippeds.some((flipped) => square.index === flipped.index);
			if (owner === opponentPlayer) {
				return matchedSquare || isCurrentSquare(square.index)
					? { ...square, owner: currentPlayer, isFlipped: !square.isFlipped }
					: { ...square, flippable: false };
			} else {
				switch (true) {
					case isCurrentSquare(square.index):
						return {
							...square,
							isFlipped: false,
							initPlayer: currentPlayer,
							owner: currentPlayer,
							flippable: false,
						};
					case matchedSquare:
						return { ...square, owner: currentPlayer, isFlipped: !square.isFlipped };
					default:
						return { ...square, flippable: false };
				}
			}
		});
		const opponentFlippables = getFlippables(flippedSquares, opponentPlayer);
		const nextPlayer =
			opponentFlippables.length === 0 && playerData[opponentPlayer].takeOverChance === 0
				? currentPlayer
				: opponentPlayer;
		const resultSquares = flippedSquares.map((square) => {
			const flippablesByNextPlayer = getFlippables(flippedSquares, nextPlayer);
			const matchedFlippable = flippablesByNextPlayer.some(
				(flippable) => flippable.index === square.index
			);
			switch (true) {
				case isCurrentSquare(square.index):
					return {
						...square,
						flippable: nextPlayer !== currentPlayer,
						isPrev: true,
					};
				case matchedFlippable || square.owner === getOppositeElement(nextPlayer):
					return {
						...square,
						flippable: true,
						isPrev: false,
					};
				default:
					return { ...square, isPrev: false };
			}
		});
		const createPlayerData = ({
			player,
			restData,
			resultSquares,
		}: {
			restData: PlayerData;
			resultSquares: SquareState[];
			player: PlayerElement;
		}): PlayerData => {
			const { takeOverChance } = restData;
			const hasFlippable = !!getFlippables(resultSquares, player).length;
			return {
				...restData,
				error: '',
				score: resultSquares.filter((square) => square.owner === player).length,
				takeOverChance:
					currentPlayer === player && owner === getOppositeElement(player)
						? takeOverChance - 1
						: takeOverChance,
				hasFlippable,
				isPassed: opponentPlayer === player && !hasFlippable && takeOverChance === 0,
			};
		};
		updateStates({ setSquareStateCallback: () => resultSquares, nextPlayer });
		setIsHovered(false);
		setPlayersData((p) => ({
			player1: createPlayerData({
				player: 'player1',
				restData: p.player1,
				resultSquares,
			}),
			player2: createPlayerData({
				player: 'player2',
				restData: p.player2,
				resultSquares,
			}),
		}));
	};
	return (
		<SquareLayout
			onMouseEnter={() => {
				!(!flippable && owner === 'unowned') && setIsHovered(true);
			}}
			onMouseLeave={() => {
				!(!flippable && owner === 'unowned') && setIsHovered(false);
			}}
			className={`${isHovered ? 'Hover' : ''}`}
			$currentPlayer={currentPlayer}
			$initPlayer={initPlayer}
			$owner={owner}
			$flippable={flippable}
		>
			<div className={`Shadow ${isFlipped ? 'Back' : 'Front'} ${isHovered ? 'Hover' : ''}`} />
			<SquareStyle
				onClick={() => {
					onSquareClickHandler();
				}}
				className={`${isFlipped ? 'Back' : 'Front'}`}
				$owner={owner}
				$initPlayer={initPlayer}
				$isHovered={isHovered}
				$currentPlayer={currentPlayer}
				$flippable={flippable}
			>
				{owner !== 'unowned' && (
					<>
						<div className="Forward" />
						<div className="Reverse" />
					</>
				)}
			</SquareStyle>
		</SquareLayout>
	);
};

const GameBoard = ({
	squareStates,
	currentPlayer,
	playerData,
	setSquareStates,
	setPlayersData,
	setCurrentPlayer,
	setSeconds,
}: GameBoardProps) => {
	const updateStates = useCallback(({ setSquareStateCallback, nextPlayer }: UpdateStatesProps) => {
		setSquareStates(setSquareStateCallback);
		setCurrentPlayer(nextPlayer);
		setSeconds(30);
	}, []);
	return (
		<GameBoardLayout>
			{squareStates.map((arr) => {
				return (
					<Square
						key={arr.index}
						currentSquare={arr}
						currentPlayer={currentPlayer}
						squareStates={squareStates}
						playerData={playerData}
						updateStates={updateStates}
						setPlayersData={setPlayersData}
					/>
				);
			})}
		</GameBoardLayout>
	);
};

const PlayerCard = ({
	playerData,
	gameState,
	currentPlayer,
	seconds,
	setPlayersData,
}: PlayerCardProps) => {
	const { index, name, score, takeOverChance, error, isPassed } = playerData;
	const { playState } = gameState;
	return (
		<PlayerCardLayout $player={index} $currentPlayer={currentPlayer} $playState={playState}>
			<div className="Wrapper">
				<span>{name}</span>
				<h3>takeover : {takeOverChance}</h3>
				<h3>score : {score}</h3>
				<h3 className="Error">{error}</h3>
				<div className="Timer">
					<span className="FakeLetter">PASSED</span>
					{index === currentPlayer && playState === 'playing' ? (
						<span className="Seconds">{seconds}</span>
					) : isPassed && playState === 'playing' ? (
						<span className="Passed">PASSED</span>
					) : null}
				</div>
			</div>
		</PlayerCardLayout>
	);
};

const Lobby = ({ lazyPlayState, gameState, setGameState, initializeStates }: LobbyProps) => {
	const coverDirections = useRef<Array<HorizontalPos | VerticalPos>>([
		'left',
		'up',
		'right',
		'down',
	]);
	const { playState, winner } = gameState;
	const createButtonElement = () => {
		switch (true) {
			case playState === 'ready':
				return <span>Start</span>;
			case winner === 'draw':
				return (
					<span>
						Draw
						<br />
						Restart
					</span>
				);
			case winner === 'player1':
			case winner === 'player2':
				return (
					<span>
						{`${capitalizeFirstLetter(winner)} Win`}
						<br />
						Restart
					</span>
				);
			default:
				return null;
		}
	};
	return (
		<LobbyLayout
			onClick={() => {
				setGameState((p) => ({ ...p, playState: 'playing' }));
				playState !== 'ready' && initializeStates();
			}}
			$onSlideIn={playState === 'playing' && lazyPlayState !== 'playing'}
		>
			{coverDirections.current.map((cover, id) => (
				<LobbyCover
					key={id}
					className={capitalizeFirstLetter(playState)}
					$index={id}
					$direction={cover}
					$winner={winner}
					$playState={playState}
				/>
			))}
			<button className="Button">{createButtonElement()}</button>
		</LobbyLayout>
	);
};

const Othello = () => {
	const createPlayerData = (player: PlayerElement) => ({
		index: player,
		name: player,
		score: 2,
		takeOverChance: 5,
		error: '',
		hasFlippable: true,
		isPassed: false,
		isTakeoverEnabled: false,
	});
	const initialStates: initialStates = useMemo(
		() => ({
			currentPlayer: 'player1',
			squareStates: Array.from({ length: 64 }, (_, id) => {
				const player1Init = id === 27 || id === 36;
				const player2Init = id === 28 || id === 35;
				return {
					index: id,
					initPlayer: player1Init ? 'player1' : player2Init ? 'player2' : 'unowned',
					owner: player1Init ? 'player1' : player2Init ? 'player2' : 'unowned',
					isFlipped: false,
					flippable: [20, 29, 34, 43].includes(id) || player2Init,
					isPrev: false,
				};
			}),
			gameState: { playState: 'ready', winner: 'undecided' },
			playerData: { player1: createPlayerData('player1'), player2: createPlayerData('player2') },
			seconds: 30,
		}),
		[]
	);
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>(initialStates.currentPlayer);
	const [squareStates, setSquareStates] = useState<SquareState[]>(initialStates.squareStates);
	const [playersData, setPlayersData] = useState<Record<PlayerElement, PlayerData>>(
		initialStates.playerData
	);
	const [seconds, setSeconds] = useState<number>(30);
	const [gameState, setGameState] = useState<OthelloGameState>(initialStates.gameState);
	const initializeStates = () => {
		const { currentPlayer, playerData, seconds, squareStates } = initialStates;
		setCurrentPlayer(currentPlayer);
		setGameState({ playState: 'playing', winner: 'undecided' });
		setPlayersData(playerData);
		setSeconds(seconds);
		setSquareStates(squareStates);
	};
	useEffect(() => {
		const interval = setInterval(() => {
			gameState.playState === 'playing' && setSeconds((p) => p - 1);
		}, 1000);
		return () => {
			interval && clearInterval(interval);
		};
	}, [gameState.playState]);
	useEffect(() => {
		if (seconds <= 0) {
			const opponentPlayer = getOppositeElement(currentPlayer);
			const nextPlayer = playersData[opponentPlayer].hasFlippable ? opponentPlayer : currentPlayer;
			setSeconds(30);
			if (nextPlayer !== currentPlayer) {
				setCurrentPlayer(nextPlayer);
				setSquareStates((p) =>
					p.map((square) =>
						getFlippables(p, nextPlayer).some((flippable) => square.index === flippable.index) ||
						square.owner === nextPlayer
							? { ...square, flippable: true }
							: { ...square, flippable: false }
					)
				);
			}
		}
	}, [seconds]);
	useEffect(() => {
		const { player1, player2 } = playersData;
		const getWinner = () => {
			switch (true) {
				case player1.score > player2.score:
					return 'player1';
				case player1.score < player2.score:
					return 'player2';
				default:
					return 'draw';
			}
		};
		if (
			!player1.hasFlippable &&
			player1.takeOverChance === 0 &&
			!player2.hasFlippable &&
			player2.takeOverChance === 0
		) {
			setGameState({ playState: 'decided', winner: getWinner() });
		}
	}, [
		playersData.player1.hasFlippable,
		playersData.player1.takeOverChance,
		playersData.player2.hasFlippable,
		playersData.player2.takeOverChance,
	]);
	const lazyPlayState = useLazyState<OthelloPlayState>(500, gameState.playState, 'ready');
	return (
		<Layout>
			<PlayerCard
				playerData={playersData.player1}
				gameState={gameState}
				currentPlayer={currentPlayer}
				seconds={seconds}
				setPlayersData={setPlayersData}
			/>
			<GameBoardWrapper>
				{gameState.playState === 'playing' || lazyPlayState === 'playing' ? (
					<GameBoard
						squareStates={squareStates}
						currentPlayer={currentPlayer}
						playerData={playersData}
						setSquareStates={setSquareStates}
						setPlayersData={setPlayersData}
						setCurrentPlayer={setCurrentPlayer}
						setSeconds={setSeconds}
					/>
				) : null}
				{gameState.playState === 'ready' ||
				lazyPlayState === 'ready' ||
				gameState.playState === 'decided' ||
				lazyPlayState === 'decided' ? (
					<Lobby
						lazyPlayState={lazyPlayState}
						gameState={gameState}
						setGameState={setGameState}
						initializeStates={initializeStates}
					/>
				) : null}
			</GameBoardWrapper>
			<PlayerCard
				playerData={playersData.player2}
				gameState={gameState}
				currentPlayer={currentPlayer}
				seconds={seconds}
				setPlayersData={setPlayersData}
			/>
		</Layout>
	);
};

export default Othello;
