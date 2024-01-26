import { fullWidthHeight } from '#styles/theme';
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

const SquareStyle = styled.div`
	border-radius: 100%;
	background-color: #606060;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: 800;
	color: var(--color-royalBlue);
	transition: transform 300ms ease;
	cursor: pointer;
	&:hover {
		background-color: red;
		transform: perspective(1000px) translateZ(200px);
	}
	&.Back {
		transform: rotateY(180deg);
	}
	&.Front {
		transform: rotateY(0);
	}
`;

const Square = () => {
	const [isSquareFlipped, setIsSquareFlipped] = useState<boolean>(false);
	return (
		<SquareStyle
			onClick={() => {
				setIsSquareFlipped(true);
			}}
			className={isSquareFlipped ? 'Back' : 'Front'}
		/>
	);
};

const GameBoard = () => {
	return (
		<GameBoardLayout>
			{Array.from({ length: 64 }, (_, id) => (
				<Square key={id} />
			))}
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
