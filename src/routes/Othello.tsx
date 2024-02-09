import { getColumnAndRow, getColumnAndRowSquares, getOppositeElement } from '#libs/utils';
import { colorBlink } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
	background-color: ${(props) => OthelloColors[props.$player].activated};
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
`;

const GameBoardLayout = styled.section`
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
	setErrors,
}: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const { index, initPlayer, isFlipped, owner, flippable, isPrev } = currentSquare;
	const onSquareClickHandler = (owner: Owner) => {
		if (owner === currentPlayer) return;
		if (isPrev) {
			setPlayersData((p) => ({
				...p,
				[currentPlayer]: {
					...p[currentPlayer],
					error: 'cannot change the recently modified square again.',
				},
			}));
			return;
		}
		const isCurrentSquare = (currentIndex: number) => currentIndex === index;
		const getFlippedBySide = (squares: SquareStates[], targetPlayer: PlayerElement) => {
			let resultSquares: SquareStates[] = [];
			for (const square of squares) {
				const { owner } = square;
				switch (owner) {
					case targetPlayer:
						return resultSquares;
					case 'unowned':
						return [];
					case getOppositeElement(targetPlayer):
						resultSquares = [...resultSquares, square];
						break;
					default:
						break;
				}
			}
			return [];
		};
		const getFlipped = (index: number, squares: SquareStates[], targetPlayer: PlayerElement) => {
			const targetSquares = getColumnAndRowSquares({ index, squareStates: squares });
			let resultSquares: SquareStates[] = [];
			for (const direction in targetSquares) {
				for (const boundary in targetSquares[direction as SquaresDirection]) {
					const assertedBoundary =
						targetSquares[direction as SquaresDirection][boundary as Boundary];
					resultSquares = [...resultSquares, ...getFlippedBySide(assertedBoundary, targetPlayer)];
				}
			}
			return resultSquares;
		};
		const getFlippables = (squares: SquareStates[], targetPlayer: PlayerElement) => {
			const opponentSquares = squares.filter(
				(arr) => arr.owner === getOppositeElement(targetPlayer)
			);
			const enclosingSquares = squares.filter((square) => {
				const { index, owner } = square;
				return (
					owner === 'unowned' &&
					[index - 1, index + 1, index - 8, index + 8].some((index) =>
						opponentSquares.some((square) => square.index === index)
					)
				);
			});
			return enclosingSquares.filter(
				(square) => getFlipped(square.index, squares, targetPlayer).length
			);
		};
		const shouldAbort = () => {
			return !flippable;
		};
		if (shouldAbort()) return;
		const flippedSquares = getFlipped(index, squareStates, currentPlayer);
		const newSquares = squareStates.map((square) => {
			const matchedSquare = flippedSquares.some(
				(flippedSquare) => square.index === flippedSquare.index
			);
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
		const flippables = getFlippables(newSquares, getOppositeElement(currentPlayer));
		const withOriginal = newSquares.map((square) => {
			const matchedFlippable = flippables.some((flippable) => flippable.index === square.index);
			switch (true) {
				case isCurrentSquare(square.index):
					return { ...square, flippable: false, isPrev: true };
				case matchedFlippable || square.owner === currentPlayer:
					return {
						...square,
						flippable: true,
						isPrev: false,
					};
				default:
					return { ...square, isPrev: false };
			}
		});
		updateStates(() => withOriginal);
		setIsHovered(false);
		setPlayersData((p) => ({
			player1: {
				...p.player1,
				score: withOriginal.filter((square) => square.owner === 'player1').length,
			},
			player2: {
				...p.player2,
				score: withOriginal.filter((square) => square.owner === 'player2').length,
			},
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
					onSquareClickHandler(owner);
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

const GameBoard = ({ squareStates, setSquareStates, setPlayersData }: GameBoardProps) => {
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>('player1');
	const [errors, setErrors] = useState<string>('');
	const updateStates = useCallback((callback: (p: SquareStates[]) => SquareStates[]) => {
		setSquareStates(callback);
		setCurrentPlayer((p) => getOppositeElement(p));
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
						setErrors={setErrors}
					/>
				);
			})}
		</GameBoardLayout>
	);
};

const PlayerCard = ({ playerData }: PlayerCardProps) => {
	const { index, name, score, takeOverChance, error } = playerData;
	return (
		<PlayerCardLayout $player={index}>
			<span>{name}</span>
			<div className="Wrapper">
				<div>
					<h3>takeover : {takeOverChance}</h3>
					<h3>score : {score}</h3>
					<h3 className="Error">{error}</h3>
				</div>
			</div>
		</PlayerCardLayout>
	);
};

const Othello = () => {
	const [squareStates, setSquareStates] = useState<SquareStates[]>(
		Array.from({ length: 64 }, (_, id) => {
			const player1Init = id === 27 || id === 36;
			const player2Init = id === 28 || id === 35;
			return {
				index: id,
				initPlayer: player1Init ? 'player1' : player2Init ? 'player2' : 'unowned',
				owner: player1Init ? 'player1' : player2Init ? 'player2' : 'unowned',
				isFlipped: false,
				flippable: [20, 29, 34, 43].includes(id),
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
		},
		player2: {
			index: 'player2',
			name: 'player2',
			score: squareStates.filter((square) => square.owner === 'player2').length,
			takeOverChance: 5,
			error: '',
		},
	});
	return (
		<Layout>
			<PlayerCard playerData={playersData.player1} />
			<GameBoard
				squareStates={squareStates}
				setSquareStates={setSquareStates}
				setPlayersData={setPlayersData}
			/>
			<PlayerCard playerData={playersData.player2} />
		</Layout>
	);
};

export default Othello;
