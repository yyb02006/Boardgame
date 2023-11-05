import React from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	background-color: crimson;
	color: #eaeaea;
	height: 100vh;
	font-size: 5rem;
	font-weight: 800;
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	overflow-y: hidden;
`;

const Home = () => {
	return <Layout>The BorderGame</Layout>;
};

export default Home;
