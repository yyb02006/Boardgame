import { fullWidthHeight } from '#styles/theme';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	padding: 80px 120px 20px 120px;
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
	border-radius: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 800;
	color: var(--color-royalBlue);
	position: relative;
	background-color: #505050;
	transition:
		transform 300ms ease,
		background-color 300ms ease;
	transform-style: preserve-3d;
	cursor: pointer;
	${fullWidthHeight}
	&.Back {
		transform: rotateY(180deg);
	}
	&.Front {
		transform: rotateY(0);
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
			props.$owner === 'player1' ? 'yellow' : 'var(--color-royalBlue)'};
	}
	& .Reverse {
		transform: rotateY(180deg);
		background-color: ${(props) =>
			props.$owner === 'player1' ? 'var(--color-royalBlue)' : 'yellow'};
	}
`;

const SquareLayout = styled.div<Omit<SquareStyleProps, '$isHovered' | '$owner'>>`
	border-radius: 100%;
	&.Hover {
		> ${SquareStyle} {
			z-index: 1;
			background-color: ${(props) => (props.$currentPlayer === 'player1' ? 'yellow' : 'blue')};
			transform: perspective(1000px) translateZ(200px)
				${(props) =>
					props.$initPlayer === props.$currentPlayer || props.$initPlayer === 'unowned'
						? null
						: 'rotateY(180deg)'};
		}
	}
`;

const Square = ({
	owner,
	initPlayer,
	isFlipped,
	index,
	currentPlayer,
	setSquareStates,
}: SquareProps) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const onSquareClick = (owner: Owner) => {
		switch (owner) {
			case 'player1':
			case 'player2':
				setSquareStates((p) => {
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
				setSquareStates((p) => {
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
			className={`${isHovered && 'Hover'}`}
			$currentPlayer={currentPlayer}
			$initPlayer={initPlayer}
		>
			<SquareStyle
				onClick={() => {
					onSquareClick(owner);
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
		Array.from({ length: 64 }, (_, id) => ({
			index: id,
			initPlayer: 'unowned',
			owner: 'unowned',
			isFlipped: false,
		}))
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
						currentPlayer={'player1'}
						setSquareStates={setSquareStates}
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
