/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	background-color: var(--bgColor-dark);
	color: #eaeaea;
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	display: flex;
	flex-direction: column;
	padding: 80px 0 0 0;
`;

const Child = styled.div`
	max-width: 400px;
	width: 100%;
	height: 200px;
	background-color: blue;
	margin: 0 40px 0 0;
	padding: 12px 24px;
	font-size: 4vw;
	h3 {
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
	}
`;

const Middle = styled.div`
	height: 200px;
	width: 200px;
	background-color: green;
`;

const BoardLayout = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	height: 100%;
	background-color: yellow;
`;

const Test = () => {
	return (
		<Layout>
			BorderGame
			<BoardLayout>
				<Child />
				<Middle />
				<Child />
			</BoardLayout>
		</Layout>
	);
};

export default Test;
