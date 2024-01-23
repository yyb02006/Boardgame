import { fullWidthHeight } from '#styles/theme';
import React, { useState } from 'react';
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
	justify-content: space-between;
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

const HambergerMenu = styled.div`
	width: 24px;
	height: 24px;
	position: relative;
	perspective: 1000px;
`;

const MenuIcon = styled.div`
	${fullWidthHeight};
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	cursor: pointer;
	> div {
		height: 2px;
		background-color: #eaeaea;
	}
	&:hover {
		> div {
			background-color: yellow;
		}
	}
`;

const Spread = styled.div`
	width: 200px;
	height: 240px;
	background-color: #202020;
	position: absolute;
	top: 0;
	right: 0;
	opacity: 0;
	box-shadow: 0 0 24px #101010;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24px 0;
	gap: 24px;
	font-size: 1rem;
	@keyframes fallIn {
		from {
			transform: translateZ(200px);
			opacity: 0;
		}
		to {
			transform: translateZ(0);
			opacity: 1;
		}
	}
	animation: fallIn 0.3s linear forwards;
	& .Title {
		font-size: 1.5em;
		font-weight: 800;
		color: yellow;
		height: auto;
		flex-shrink: 0;
	}
	& .Links {
		${fullWidthHeight}
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		font-weight: 600;
		& > a {
			&:hover {
				color: var(--color-royalBlue);
			}
		}
	}
`;

const CloseButton = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	&::before,
	&::after {
		content: '';
		position: absolute;
		display: block;
		width: 80%;
		height: 2px;
		background-color: #bababa;
		z-index: 1;
	}
	&::after {
		transform: rotate(45deg);
	}
	&::before {
		transform: rotate(-45deg);
	}
`;

interface HeaderProps {
	title: string;
}

const Header = ({ title }: HeaderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Layout>
			<HeaderNav to={'/'}>{title}</HeaderNav>
			<HambergerMenu
				onClick={() => {
					setIsOpen(true);
				}}
			>
				{isOpen ? (
					<Spread>
						<CloseButton></CloseButton>
						<span className="Title">Games</span>
						<div className="Links">
							<NavLink to={'/'}>BorderGame</NavLink>
							<NavLink to={'/card-flipper'}>CardFlipper</NavLink>
							<span>Puzzles</span>
						</div>
					</Spread>
				) : (
					<MenuIcon>
						<div />
						<div />
						<div />
					</MenuIcon>
				)}
			</HambergerMenu>
		</Layout>
	);
};

export default Header;
