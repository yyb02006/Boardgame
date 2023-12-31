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
