import { getColumnAndRow, getColumnAndRowSquares, getOppositeElement } from '#libs/utils';
import { colorBlink } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import { capitalize, divide } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	padding: 80px 120px 40px 120px;
	display: flex;
	justify-content: center;
`;

const GameBoardLayout = styled.section`
	height: 100%;
	aspect-ratio: 1;
	display: grid;
	gap: 8px;
	grid-template-columns: repeat(8, auto);
	grid-template-rows: repeat(8, auto);
`;

const OthelloColors = {
	player1: { activated: 'yellow', flippable: '#b1b39e' },
	player2: { activated: 'var(--color-royalBlue)', flippable: '#9b9bbb' },
	common: '#505050',
};

const SquareStyle = styled.div<SquareStyleProps>`
	${fullWidthHeight}
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 800;
	position: relative;
	${(props) =>
		props.$flippable
			? colorBlink({
					name: 'square',
					startColor: OthelloColors.common,
					alternateColor: OthelloColors[props.$currentPlayer].flippable,
					duration: 700,
					targetProperty: 'backgroundColor',
			  })
			: css`
					background-color: ${OthelloColors.common};
			  `}
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
			props.$initPlayer === 'player1' ? 'yellow' : 'var(--color-royalBlue)'};
	}
	& .Reverse {
		transform: rotateY(180deg);
		background-color: ${(props) =>
			props.$initPlayer === 'player1' ? 'var(--color-royalBlue)' : 'yellow'};
	}
`;

const SquareLayout = styled.div<Omit<SquareStyleProps, '$isHovered' | '$flippable'>>`
	border-radius: 100%;
	position: relative;
	cursor: pointer;
	&.Hover {
		> ${SquareStyle} {
			z-index: 1;
			background-color: ${(props) =>
				props.$owner === 'unowned' && props.$currentPlayer === 'player1'
					? 'yellow'
					: 'var(--color-royalBlue)'};
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

const Square = ({ currentSquare, currentPlayer, squareStates, updateStates }: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const { index, initPlayer, isFlipped, owner, flippable } = currentSquare;
	const shouldAbort = () => {
		const squares = getColumnAndRowSquares({ index, squareStates });
		const position = getColumnAndRow(index, 8, 8);
		return owner !== 'unowned';
	};
	const onSquareClickHandler = (owner: Owner) => {
		if (owner === currentPlayer) return;
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
		if (!getFlippables(squareStates, currentPlayer).some((square) => square.index === index))
			return;
		const resultSquares: SquareStates[] = squareStates.map((square) =>
			square.index === index
				? { ...square, isFlipped: !square.isFlipped, owner: currentPlayer }
				: square
		);
		updateStates(index, (prevSquares) => {
			const flippedSquares = getFlipped(index, prevSquares, currentPlayer);
			const newSquares = prevSquares.map((square, id) => {
				const matchedSquare = flippedSquares.find(
					(flippedSquare, id) => square.index === flippedSquare.index
				);
				return matchedSquare
					? { ...matchedSquare, owner: currentPlayer, isFlipped: !matchedSquare.isFlipped }
					: { ...square, flippable: false };
			});
			switch (owner) {
				case 'player1':
				case 'player2':
					newSquares[index] = {
						...newSquares[index],
						isFlipped: !newSquares[index].isFlipped,
						owner: currentPlayer,
					};
					break;
				case 'unowned':
					newSquares[index] = {
						...newSquares[index],
						isFlipped: false,
						initPlayer: currentPlayer,
						owner: currentPlayer,
						flippable: false,
					};
					break;
				default:
					break;
			}
			const flippables = getFlippables(newSquares, getOppositeElement(currentPlayer));
			const withOriginal = newSquares.map((square, id) => {
				const matchedFlippable = flippables.find((flippable) => flippable.index === square.index);
				return matchedFlippable
					? {
							...matchedFlippable,
							flippable: true,
					  }
					: square;
			});
			return withOriginal;
		});
		setIsHovered(false);
	};
	return (
		<SquareLayout
			onMouseEnter={() => {
				setIsHovered(true);
			}}
			onMouseLeave={() => {
				setIsHovered(false);
			}}
			className={`${isHovered ? 'Hover' : ''}`}
			$currentPlayer={currentPlayer}
			$initPlayer={initPlayer}
			$owner={owner}
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

const GameBoard = () => {
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
			};
		})
	);
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>('player1');
	const updateStates = useCallback(
		(index: number, callback: (p: SquareStates[]) => SquareStates[]) => {
			setSquareStates(callback);
			setCurrentPlayer((p) => getOppositeElement(p));
		},
		[]
	);
	return (
		<GameBoardLayout>
			{squareStates.map((arr, id) => {
				return (
					<Square
						key={arr.index}
						currentSquare={arr}
						currentPlayer={currentPlayer}
						squareStates={squareStates}
						updateStates={updateStates}
					/>
				);
			})}
		</GameBoardLayout>
	);
};

const Othello = () => {
	return (
		<Layout>
			<GameBoard></GameBoard>
		</Layout>
	);
};

export default Othello;
