import { getColumnAndRow, getColumnAndRowSquares, getOppositeElement } from '#libs/utils';
import { fullWidthHeight } from '#styles/theme';
import { capitalize, divide } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

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

const SquareStyle = styled.div<SquareStyleProps>`
	${fullWidthHeight}
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 800;
	color: var(--color-royalBlue);
	position: relative;
	background-color: ${(props) => (props.$owner === 'unowned' ? '#505050' : 'transparent')};
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

const SquareLayout = styled.div<Omit<SquareStyleProps, '$isHovered'>>`
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
	const { index, initPlayer, isFlipped, owner } = currentSquare;
	const shouldAbort = () => {
		const squares = getColumnAndRowSquares({ index, squareStates });
		const position = getColumnAndRow(index, 8, 8);
		const flippable = {
			column: {
				lower:
					squares.column.lower.find((arr, id) => arr.owner === currentPlayer) &&
					squares.column.lower.filter((arr, id) => {
						const targetIndex = squares.column.lower.find((arr, id) => arr.owner === currentPlayer)
							?.index;
						if (targetIndex) {
							return arr.index < targetIndex || arr.index > position.column;
						} else {
							return false;
						}
					}),
				upper:
					squares.column.upper.find((arr, id) => arr.owner === currentPlayer) &&
					squares.column.upper.filter((arr, id) => {
						const targetIndex = squares.column.upper.find((arr, id) => arr.owner === currentPlayer)
							?.index;
						if (targetIndex) {
							return arr.index < targetIndex || arr.index > position.column;
						} else {
							return false;
						}
					}),
			},
			row: {
				lower:
					squares.row.lower.find((arr, id) => arr.owner === currentPlayer) &&
					squares.row.lower.filter((arr, id) => {
						const targetIndex = squares.row.lower.find((arr, id) => arr.owner === currentPlayer)
							?.index;
						if (targetIndex) {
							return arr.index < targetIndex || arr.index > position.row;
						} else {
							return false;
						}
					}),
				upper:
					squares.row.upper.find((arr, id) => arr.owner === currentPlayer) &&
					squares.row.upper.filter((arr, id) => {
						const targetIndex = squares.row.upper.find((arr, id) => arr.owner === currentPlayer)
							?.index;
						if (targetIndex) {
							return arr.index < targetIndex || arr.index > position.row;
						} else {
							return false;
						}
					}),
			},
		};
		/* const getFlippable = () => {
			
		}; */
		return owner !== 'unowned';
	};
	const onSquareClickHandler = (owner: Owner) => {
		if (owner === currentPlayer) return;
		const getFlippedBySide = (squares: SquareStates[]) => {
			let resultSquares: SquareStates[] = [];
			for (const square of squares) {
				const { owner } = square;
				switch (owner) {
					case currentPlayer:
						return resultSquares;
					case 'unowned':
						return [];
					case getOppositeElement(currentPlayer):
						resultSquares = [...resultSquares, square];
						break;
					default:
						break;
				}
			}
			return [];
		};
		const getFlipped = () => {
			const targetSquares = getColumnAndRowSquares({ index, squareStates });
			let resultSquares: SquareStates[] = [];
			for (const direction in targetSquares) {
				for (const boundary in targetSquares[direction as SquaresDirection]) {
					const assertedBoundary =
						targetSquares[direction as SquaresDirection][boundary as Boundary];
					resultSquares = [...resultSquares, ...getFlippedBySide(assertedBoundary)];
				}
			}
			return resultSquares;
		};
		updateStates(index, (p) => {
			const flippedSquares = getFlipped();
			const newStates = p.map((square, id) => {
				const matchedSquare = flippedSquares.find(
					(flippedSquare, id) => square.index === flippedSquare.index
				);
				return matchedSquare
					? { ...matchedSquare, owner: currentPlayer, isFlipped: !matchedSquare.isFlipped }
					: square;
			});
			switch (owner) {
				case 'player1':
				case 'player2':
					newStates[index] = {
						...newStates[index],
						isFlipped: !newStates[index].isFlipped,
						owner: currentPlayer,
					};
					break;
				case 'unowned':
					newStates[index] = {
						...newStates[index],
						isFlipped: false,
						initPlayer: currentPlayer,
						owner: currentPlayer,
					};
					break;
				default:
					break;
			}
			return newStates;
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
