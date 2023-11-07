import React from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	background-color: var(--bgColor-navy);
	color: #eaeaea;
	height: 100vh;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	overflow-y: hidden;
	padding: 80px 120px 0 120px;
`;

const BoardStyle = styled.div`
	background-color: #1244db;
	width: 100%;
	aspect-ratio: 1/1;
`;

const BoardItems = styled.div`
	border: 1px solid white;
	background-color: red;
	width: 100px;
	aspect-ratio: 1/1;
`;

/* interface BoardProps {
	children: ComponentChildren;
} */

const Board = () => {
	const test = Array(25)
		.fill(undefined)
		.map((arr, i) => i + 1);

	return (
		<BoardStyle>
			<div
				style={{ backgroundColor: 'red', width: '100px', height: '100px' }}
			></div>
			{test.map((arr, id) => (
				<BoardItems key={id}>dd</BoardItems>
			))}
		</BoardStyle>
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
