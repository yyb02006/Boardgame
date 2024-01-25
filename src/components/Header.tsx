import { useAppContext } from '#AppContext';
import { fadeInZ } from '#styles/animations';
import { fullWidthHeight } from '#styles/theme';
import React, { useEffect, useState } from 'react';
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
	box-shadow: 0 0 24px #101010;
	border-radius: 16px;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 24px 0;
	gap: 24px;
	font-size: 1rem;
	&.Open {
		${fadeInZ({
			name: 'open',
			distance: 200,
			duration: 0.3,
			seqDirection: 'normal',
		})}
	}
	&.Closed {
		${fadeInZ({
			name: 'close',
			distance: 200,
			duration: 0.3,
			seqDirection: 'reverse',
		})}
	}
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

const CloseButton = styled.button`
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

const LinkWrapper = ({ to, label, page }: { to: string; label: string; page: PageState }) => {
	const { setPageState } = useAppContext();
	return (
		<NavLink
			to={to}
			onClick={() => {
				setPageState(page);
			}}
		>
			{label}
		</NavLink>
	);
};

const Header = ({ title }: HeaderProps) => {
	const { pageState } = useAppContext();
	const [isOpen, setIsOpen] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const menuToggleHandler = (isOpen: boolean) => {
		if (isOpen) {
			setIsOpen(true);
			setIsVisible(true);
		} else {
			setIsVisible(false);
			setTimeout(() => {
				setIsOpen(false);
			}, 300);
		}
	};
	useEffect(() => {
		setIsOpen(false);
	}, [pageState]);
	return (
		<Layout>
			<HeaderNav to={'/'}>{title}</HeaderNav>
			<HambergerMenu>
				{isOpen ? (
					<Spread className={isVisible ? 'Open' : 'Closed'}>
						<CloseButton
							onClick={() => {
								menuToggleHandler(false);
							}}
						/>
						<span className="Title">Games</span>
						<div className="Links">
							<LinkWrapper to="/" label="BorderGame" page="borderGame" />
							<LinkWrapper to="/card-flipper" label="CardFlipper" page="cardFlipper" />
							<LinkWrapper to="/test" label="Test" page="test" />
						</div>
					</Spread>
				) : (
					<MenuIcon
						onClick={() => {
							menuToggleHandler(true);
						}}
					>
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
