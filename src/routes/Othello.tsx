import useLazyState from '#hooks/useLazyState';
import {
	getColumnAndRow,
	getColumnAndRowSquares,
	getFlippables,
	getFlipped,
	getOppositeElement,
} from '#libs/utils';
import { colorBlink, slideIn } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import React, { ReactNode, lazy, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import styled, { css } from 'styled-components';

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
	justify-content: center;
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
`;

const BoardCover = styled.div`
	${fullWidthHeight}
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 80px;
	top: 0;
	left: 0;
`;

const LobbyLayout = styled(BoardCover)<LobbyLayoutProps>`
	& .Start {
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

const ResultLayout = styled(BoardCover)``;

const GameBoardWrapper = styled.section`
	position: relative;
	width: 100%;
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
	updateStates,
	setPlayersData,
}: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const { index, initPlayer, isFlipped, owner, flippable, isPrev } = currentSquare;
	const onSquareClickHandler = () => {
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
			return !flippable || owner === currentPlayer;
		};
		if (shouldAbort()) {
			return;
		} else if (
			owner === getOppositeElement(currentPlayer) &&
			squareStates.filter((square) => square.owner === currentPlayer).length < 8
		) {
			updateError('cannot takeover until the own squares reaches 8.');
			return;
		} else if (isPrev) {
			updateError('cannot change the recently modified square again.');
			return;
		}
		const isCurrentSquare = (currentIndex: number) => currentIndex === index;
		const flippeds = getFlipped(index, squareStates, currentPlayer);
		const flippedSquares = squareStates.map((square) => {
			const matchedSquare = flippeds.some((flipped) => square.index === flipped.index);
			if (owner === getOppositeElement(currentPlayer)) {
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
		const flippables = getFlippables(flippedSquares, getOppositeElement(currentPlayer));
		const nextPlayer = flippables.length > 0 ? getOppositeElement(currentPlayer) : currentPlayer;
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
			resultSquares: SquareStates[];
			player: PlayerElement;
		}): PlayerData => {
			const { takeOverChance } = restData;
			return {
				...restData,
				error: '',
				score: resultSquares.filter((square) => square.owner === player).length,
				takeOverChance:
					currentPlayer === player && owner === getOppositeElement(player)
						? takeOverChance - 1
						: takeOverChance,
				hasFlippable: !!getFlippables(resultSquares, player).length,
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
						updateStates={updateStates}
						setPlayersData={setPlayersData}
					/>
				);
			})}
		</GameBoardLayout>
	);
};

const PlayerCard = ({ playerData, gameState, currentPlayer, seconds }: PlayerCardProps) => {
	const { index, name, score, takeOverChance, error } = playerData;
	return (
		<PlayerCardLayout
			$player={index}
			$currentPlayer={currentPlayer}
			$playState={gameState.playState}
		>
			<span>{name}</span>
			<div className="Wrapper">
				<div>
					<h3>takeover : {takeOverChance}</h3>
					<h3>score : {score}</h3>
					<h3 className="Error">{error}</h3>
					<div className="Timer">
						{playerData.index === currentPlayer && gameState.playState === 'playing' ? (
							<span className="Seconds">{seconds}</span>
						) : !playerData.hasFlippable ? (
							<span className="Passed">PASSED</span>
						) : null}
					</div>
				</div>
			</div>
		</PlayerCardLayout>
	);
};

const Lobby = ({ lazyPlayState, playState, setGameState }: LobbyProps) => {
	return (
		<LobbyLayout
			onClick={() => {
				setGameState((p) => ({ ...p, playState: 'playing' }));
			}}
			$onSlideIn={playState === 'playing' && lazyPlayState !== 'playing'}
		>
			<button className="Start">Start</button>
		</LobbyLayout>
	);
};

const Result = () => {
	return <ResultLayout></ResultLayout>;
};

const Othello = () => {
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>('player1');
	const [squareStates, setSquareStates] = useState<SquareStates[]>(
		Array.from({ length: 64 }, (_, id) => {
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
		})
	);
	const [playersData, setPlayersData] = useState<Record<PlayerElement, PlayerData>>({
		player1: {
			index: 'player1',
			name: 'player1',
			score: squareStates.filter((square) => square.owner === 'player1').length,
			takeOverChance: 5,
			error: '',
			hasFlippable: true,
		},
		player2: {
			index: 'player2',
			name: 'player2',
			score: squareStates.filter((square) => square.owner === 'player2').length,
			takeOverChance: 5,
			error: '',
			hasFlippable: true,
		},
	});
	const [seconds, setSeconds] = useState<number>(30);
	const [gameState, setGameState] = useState<OthelloGameState>({
		playState: 'ready',
		winner: 'undecided',
	});
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
		if (!player1.hasFlippable && !player2.hasFlippable) {
			setGameState({ playState: 'decided', winner: getWinner() });
		}
	}, [playersData.player1.hasFlippable, playersData.player2.hasFlippable]);
	const lazyPlayState = useLazyState<OthelloPlayState>(500, gameState.playState, 'ready');
	console.log(gameState);
	return (
		<Layout>
			<PlayerCard
				playerData={playersData.player1}
				gameState={gameState}
				currentPlayer={currentPlayer}
				seconds={seconds}
			/>
			<GameBoardWrapper>
				{gameState.playState === 'playing' || lazyPlayState === 'playing' ? (
					<GameBoard
						squareStates={squareStates}
						currentPlayer={currentPlayer}
						setSquareStates={setSquareStates}
						setPlayersData={setPlayersData}
						setCurrentPlayer={setCurrentPlayer}
						setSeconds={setSeconds}
					/>
				) : null}
				{gameState.playState === 'ready' || lazyPlayState === 'ready' ? (
					<Lobby
						lazyPlayState={lazyPlayState}
						playState={gameState.playState}
						setGameState={setGameState}
					/>
				) : null}
			</GameBoardWrapper>
			<PlayerCard
				playerData={playersData.player2}
				gameState={gameState}
				currentPlayer={currentPlayer}
				seconds={seconds}
			/>
		</Layout>
	);
};

export default Othello;
