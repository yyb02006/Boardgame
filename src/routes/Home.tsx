/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import styled from 'styled-components';

interface directionInterface {
	direction: direction;
}

type direction = 'horizental' | 'vertical';

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
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	display: grid;
	height: 100%;
	aspect-ratio: 1;
`;

const Boxes = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const BoardBordersContainer = styled.div<{ direction: string }>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: ${(props) => props.direction};
	justify-content: space-between;
`;

const BoxStyle = styled.div<directionInterface & { selected: boolean }>`
	position: relative;
	width: ${(props) => (props.direction === 'horizental' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizental' ? '20%' : '100%')};
	flex-direction: ${(props) =>
		props.direction === 'horizental' ? 'row' : 'column'};
	display: flex;
	flex-wrap: wrap;
	background-color: ${(props) => (props.selected ? 'yellow' : 'transparent')};
`;

const BoxWrapper = styled.div<directionInterface & { isLast: boolean }>`
	font-size: 1rem;
	color: #101010;
	width: ${(props) => (props.direction === 'horizental' ? '20%' : 0)};
	height: ${(props) => (props.direction === 'horizental' ? 0 : '20%')};
	background-color: yellow;
	position: relative;
	align-self: ${(props) => (props.isLast ? 'flex-end' : 'flex-start')};
`;

const FakeHover = styled.div``;

const BoxSide = styled.div``;

const BoxHover = styled.div<directionInterface>`
	width: ${(props) =>
		props.direction === 'horizental' ? 'calc(100% - 40px)' : '40px'};
	height: ${(props) =>
		props.direction === 'horizental' ? '40px' : 'calc(100% - 40px)'};
	position: absolute;
	transform: ${(props) =>
		props.direction === 'horizental' ? 'translateY(-50%)' : 'translateX(-50%)'};
	top: ${(props) => (props.direction === 'horizental' ? 0 : '20px')};
	left: ${(props) => (props.direction === 'horizental' ? '20px' : 0)};
	z-index: 1;
	display: flex;
	align-items: ${(props) =>
		props.direction === 'horizental' ? 'center' : 'center'};
	justify-content: ${(props) =>
		props.direction === 'horizental' ? 'center' : 'center'};
	border-color: red;
	&:hover {
		background-color: antiquewhite;
		border-color: green;
		z-index: 2;
	}
	${FakeHover} {
		position: absolute;
		width: ${(props) =>
			props.direction === 'horizental' ? 'calc(100% + 44px)' : '100%'};
		height: ${(props) =>
			props.direction === 'horizental' ? '100%' : 'calc(100% + 44px)'};
		background-color: inherit;
		pointer-events: none;
	}
	${BoxSide} {
		width: ${(props) =>
			props.direction === 'horizental' ? 'calc(100% + 44px)' : 'auto'};
		height: ${(props) =>
			props.direction === 'horizental' ? 'auto' : 'calc(100% + 44px)'};
		border-width: 2px;
		border-style: solid;
		border-color: inherit;
		position: absolute;
		left: ${(props) => (props.direction === 'horizental' ? '-22px' : 'auto')};
		top: ${(props) => (props.direction === 'horizental' ? 'auto' : '-22px')};
		pointer-events: none;
	}
`;

const BoxCollection = ({
	direction,
	borderId,
	isLast = false,
}: directionInterface & { borderId: number; isLast?: boolean }) => {
	const [selected, setSelected] = useState();
	const onBoxClick = (isLast: boolean) => {
		console.log(direction, borderId, isLast);
	};
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, sideId) => (
					<BoxWrapper key={sideId} direction={direction} isLast={isLast}>
						<BoxHover
							onClick={() => {
								onBoxClick(isLast);
							}}
							direction={direction}
						>
							<FakeHover />
							<BoxSide />
						</BoxHover>
					</BoxWrapper>
				))}
		</>
	);
};

const BorderBox = ({ direction }: directionInterface) => {
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, borderId) => (
					<BoxStyle key={borderId} direction={direction} selected={false}>
						<BoxCollection direction={direction} borderId={borderId} />
						{borderId === 4 ? (
							<BoxCollection
								direction={direction}
								isLast={borderId === 4}
								borderId={borderId}
							/>
						) : null}
					</BoxStyle>
				))}
		</>
	);
};

const Board = () => {
	return (
		<BoardLayout>
			<BoardItemsContainer>
				{Array(25)
					.fill(undefined)
					.map((_, id) =>
						id < 5 || id > 20 || id % 5 === 0 || id % 5 === 4 ? (
							<Boxes key={id}>1</Boxes>
						) : (
							<Boxes key={id}>2</Boxes>
						)
					)}
				<BoardBordersContainer direction="column">
					<BoardBordersContainer direction="row">
						<BorderBox direction="vertical" />
					</BoardBordersContainer>
					<BorderBox direction="horizental" />
				</BoardBordersContainer>
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
