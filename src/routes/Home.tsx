import React from 'react';
import styled from 'styled-components';

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

const BoardBordersContainer = styled.div<{ borderDirection: string }>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: ${(props) => props.borderDirection};
	justify-content: space-between;
`;

const BorderWrapper = styled.div<{ direction: direction }>`
	font-size: 1rem;
	color: #101010;
	width: ${(props) => (props.direction === 'vertical' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'vertical' ? '20%' : '100%')};
	position: relative;
`;

const Border = styled.div<{ direction: direction; isLast: boolean }>`
	height: calc(100% + 4px);
	width: calc(100% + 4px);
	position: absolute;
	top: -2px;
	left: -2px;
	text-align: ${(props) => (props.direction === 'vertical' ? 'start' : 'end')};
	border-color: red;
	border-style: solid;
	border-width: ${(props) =>
		props.direction === 'vertical'
			? props.isLast
				? '0 4px 0 4px'
				: '0 0 0 4px'
			: props.isLast
			? '4px 0 4px 0'
			: '4px 0 0 0'};
`;

const BorderStyle = styled.div<{
	direction: direction;
}>`
	position: relative;
	width: ${(props) => (props.direction === 'horizental' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizental' ? '20%' : '100%')};
	display: flex;
	flex-direction: ${(props) =>
		props.direction === 'horizental' ? 'row' : 'column'};
	cursor: pointer;
`;

type direction = 'horizental' | 'vertical';

const BorderBox = ({ direction }: { direction: direction }) => {
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, borderId) => (
					<BorderStyle key={borderId} direction={direction}>
						{Array(5)
							.fill(undefined)
							.map((_, sideId) => (
								<BorderWrapper key={sideId} direction={direction}>
									<Border
										direction={direction}
										isLast={borderId === 4}
									>{`${borderId}-${sideId}`}</Border>
								</BorderWrapper>
							))}
					</BorderStyle>
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
				<BoardBordersContainer borderDirection="column">
					<BoardBordersContainer borderDirection="row">
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
