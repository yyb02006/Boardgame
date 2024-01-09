import React from 'react';
import styled from 'styled-components';

const Layout = styled.section`
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 120px 40px 120px;
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: 80px 0 40px 0;
	}
`;

const CardStyle = styled.div`
	width: 200px;
	height: 320px;
	color: red;
	background-color: yellow;
	position: relative;
`;

const Card = () => {
	return <CardStyle>card</CardStyle>;
};

const CardFlipper = () => {
	return (
		<Layout>
			<Card></Card>
		</Layout>
	);
};

export default CardFlipper;
