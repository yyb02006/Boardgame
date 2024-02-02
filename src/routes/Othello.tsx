import { getOppositeElement } from '#libs/utils';
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

const Square = ({
	owner,
	initPlayer,
	isFlipped,
	index,
	currentPlayer,
	updateStates,
}: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	/* const shouldAbort = () => {
		return owner !== 'unowned';
	}; */
	const onSquareClickHandler = (owner: Owner) => {
		switch (owner) {
			case 'player1':
			case 'player2':
				if (owner === currentPlayer) break;
				updateStates(index, (p) => {
					const newStates = [...p];
					newStates[index] = {
						...newStates[index],
						isFlipped: !newStates[index].isFlipped,
						owner: currentPlayer,
					};
					return newStates;
				});
				setIsHovered(false);
				break;
			case 'unowned':
				updateStates(index, (p) => {
					const newStates = [...p];
					newStates[index] = {
						...newStates[index],
						isFlipped: false,
						initPlayer: currentPlayer,
						owner: currentPlayer,
					};
					return newStates;
				});
				setIsHovered(false);
				break;
			default:
				break;
		}
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
			const getColumnAndRow = (number: number) => {
				return { column: number % 8, row: Math.floor(number / 8) };
			};
			const { column, row } = getColumnAndRow(index);
			/* squareStates.filter((square) => {
				const { index } = square;
				const squareLocation = getColumnAndRow(index);
				return (
					!(squareLocation.column === column && squareLocation.row === row) &&
					squareLocation.column === column
				);
			}); */
			console.log(
				squareStates.reduce<{
					column: { lower: SquareStates[]; upper: SquareStates[] };
					row: { lower: SquareStates[]; upper: SquareStates[] };
				}>(
					(accumulator, currentSquare) => {
						const squarePosition = getColumnAndRow(currentSquare.index);
						switch (true) {
							case squarePosition.column === column && squarePosition.row === row:
								return accumulator;
							case squarePosition.column === column || squarePosition.row === row: {
								const range: 'lower' | 'upper' = currentSquare.index < index ? 'lower' : 'upper';
								const targetDirection: 'column' | 'row' =
									squarePosition.column === column ? 'column' : 'row';
								return {
									...accumulator,
									[targetDirection]: {
										...accumulator[targetDirection],
										[range]: [...accumulator[targetDirection][range], currentSquare],
									},
								};
							}
							default:
								return accumulator;
						}
					},
					{ column: { lower: [], upper: [] }, row: { lower: [], upper: [] } }
				)
			);
			setSquareStates(callback);
			setCurrentPlayer((p) => getOppositeElement(p));
		},
		[]
	);
	return (
		<GameBoardLayout>
			{squareStates.map((arr, id) => {
				const { index, initPlayer, isFlipped, owner } = arr;
				return (
					<Square
						key={index}
						index={index}
						initPlayer={initPlayer}
						owner={owner}
						isFlipped={isFlipped}
						currentPlayer={currentPlayer}
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
