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
	grid-template-columns: repeat(5, 1fr);
	background-color: pink;
	display: grid;
	height: 100%;
	aspect-ratio: 1;
`;

const BoardItems = styled.div`
	border: 1px solid white;
	background-color: red;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		background-color: #ffa600;
	}
`;

const Board = () => {
	const test = Array(25)
		.fill(undefined)
		.map((arr, i) => i + 1);
	return (
		<BoardLayout>
			<BoardItemsContainer>
				{test.map((arr, id) => (
					<BoardItems key={id}></BoardItems>
				))}
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
