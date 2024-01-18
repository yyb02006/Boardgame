import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Layout = styled.section`
	height: 80px;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	padding: 0 48px 10px 48px;
	display: flex;
	align-items: center;
	z-index: 1;
	@media screen and (max-width: 1024px) {
		height: 80px;
		font-size: 2rem;
	}
	@media screen and (max-width: 640px) {
		height: 60px;
		padding: 0 48px;
		font-size: 1rem;
	}
`;

const HeaderNav = styled(NavLink)`
	font-weight: 700;
`;

interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	return (
		<Layout>
			<HeaderNav to={'/'}>{title}</HeaderNav>
		</Layout>
	);
};

export default Header;
