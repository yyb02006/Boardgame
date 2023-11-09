import React from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	background-color: var(--bgColor-dark);
	color: #eaeaea;
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 120px 40px 120px;
	display: flex;
	flex-direction: column;
`;

const BoardLayout = styled.div`
	position: relative;
	background-color: #1244db;
	display: flex;
	justify-content: center;
	height: 100%;
`;

const BoardItemsContainer = styled.div`
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	background-color: pink;
	display: grid;
	height: 100%;
	aspect-ratio: 1;
`;

const BoardBoxes = styled.div`
	position: relative;
	background-color: red;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		background-color: #ffa600;
	}
`;

const BoardBordersContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const VerticalBorders = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	height: 4px;
	background-color: #eaeaea;
	cursor: pointer;
`;

/* const HorizentalBorders = styled.div`
	top: 0;
	left: 0;
	width: 1px;
`; */

const Board = () => {
	return (
		<BoardLayout>
			<BoardItemsContainer>
				{Array(25)
					.fill(undefined)
					.map((_, id) =>
						id < 5 || id > 20 || id % 5 === 0 || id % 5 === 4 ? (
							<BoardBoxes key={id}>1</BoardBoxes>
						) : (
							<BoardBoxes key={id}>2</BoardBoxes>
						)
					)}
				<BoardBordersContainer>
					{Array(6)
						.fill(undefined)
						.map((_, id) => (
							<VerticalBorders key={id}></VerticalBorders>
						))}
				</BoardBordersContainer>
			</BoardItemsContainer>
		</BoardLayout>
	);
};

const Home = () => {
	return (
		<Layout>
			The BorderGame
			<Board />
		</Layout>
	);
};

export default Home;
