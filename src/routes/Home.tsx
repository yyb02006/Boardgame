import React from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	background-color: #101010;
	color: #eaeaea;
	height: 100vh;
	font-size: 5rem;
	font-weight: 800;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow-y: hidden;
`;

const Home = () => {
	return <Layout>The BorderGame</Layout>;
};

export default Home;
