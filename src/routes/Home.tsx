/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface directionInterface {
	direction: direction;
}

type direction = 'horizental' | 'vertical';

type setSelected = React.Dispatch<React.SetStateAction<selected>>;

type setBoxes = React.Dispatch<
	React.SetStateAction<
		Array<{
			id: number;
			isPartialSurrounded: boolean;
			isSurrounded: boolean;
		}>
	>
>;

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

const Boxes = styled.div<{ $isSurrounded: boolean }>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) =>
		props.$isSurrounded ? '#1696eb' : 'transperant'};
`;

const BoardBordersContainer = styled.div<{ $borderDirection: string }>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: ${(props) => props.$borderDirection};
	justify-content: space-between;
`;

const BoxStyle = styled.div<directionInterface>`
	position: relative;
	width: ${(props) => (props.direction === 'horizental' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizental' ? '20%' : '100%')};
	flex-direction: ${(props) =>
		props.direction === 'horizental' ? 'row' : 'column'};
	display: flex;
	flex-wrap: wrap;
`;

const BoxWrapper = styled.div<directionInterface & { $isLast: boolean }>`
	font-size: 1rem;
	color: #101010;
	width: ${(props) => (props.direction === 'horizental' ? '20%' : 0)};
	height: ${(props) => (props.direction === 'horizental' ? 0 : '20%')};
	position: relative;
	align-self: ${(props) => (props.$isLast ? 'flex-end' : 'flex-start')};
`;

const FakeHover = styled.div``;

const BoxSide = styled.div``;

const BoxHover = styled.div<directionInterface & { $isSelected: boolean }>`
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
	border-color: ${(props) => (props.$isSelected ? 'red' : 'yellow')};
	z-index: ${(props) => (props.$isSelected ? 2 : 1)};
	&:hover {
		background-color: blueviolet;
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

interface boxCollectionProps extends directionInterface {
	setSelected: setSelected;
	borderId: number;
	isLast?: boolean;
	selected: selected;
	boxes: boxes;
	setBoxes: setBoxes;
}

const BoxCollection = ({
	direction,
	borderId,
	isLast = false,
	selected,
	boxes,
	setSelected,
	setBoxes,
}: boxCollectionProps) => {
	const onBoxClick = (sideId: number) => {
		console.log('border = ' + borderId, 'side = ' + sideId);
		const boxLocationAtUpPos = (
			direction: direction,
			isUpPos: boolean = true
		) =>
			direction === 'horizental'
				? (borderId - (isUpPos ? 1 : 0)) * 5 + sideId
				: sideId * 5 + borderId - (isUpPos ? 1 : 0);
		const handleSelected = (kind: direction) => {
			selected[kind].filter(
				(item) => item.border === borderId && item.side === sideId
			).length > 0 ||
				setSelected((p) => ({
					...p,
					[kind]: [
						...p[kind],
						{ border: borderId, side: sideId, isSelected: true },
					],
				}));
		};
		const handleBox = (kind: direction, isUpPos: boolean = true) => {
			const processHorizental = () =>
				selected[kind === 'horizental' ? 'vertical' : 'horizental']
					.filter(
						(item) =>
							(item.border === sideId || item.border === sideId + 1) &&
							item.side === (isUpPos ? borderId - 1 : borderId)
					)
					.map((arr) => arr.isSelected);
			const processVertical = () =>
				selected[kind]
					.filter(
						(item) =>
							item.border === (isUpPos ? borderId - 1 : borderId + 1) &&
							item.side === sideId
					)
					.map((arr) => arr.isSelected);

			if (processVertical().length > 0 && processHorizental().length === 2) {
				return true;
			} else if (
				processVertical().length > 0 &&
				processHorizental().length === 1
			) {
				return boxLocationAtUpPos(direction, isUpPos);
			} else {
				return false;
			}
		};
		handleSelected(direction);
		const updateBoxState = (truePart: number, falsePart: number) => {
			setBoxes((p) => {
				const newBoxes = [...p];
				newBoxes[
					direction === 'horizental' ? truePart : falsePart
				].isSurrounded = true;
				return newBoxes;
			});
		};
		if (handleBox(direction) === true) {
			updateBoxState((borderId - 1) * 5 + sideId, borderId - 1 + sideId * 5);
			console.log((borderId - 1) * 5 + sideId);
		}
		if (handleBox(direction, false) === true) {
			updateBoxState(borderId * 5 + sideId, borderId + sideId * 5);
			console.log((sideId - 1) * 5 + borderId);
		}
		if (typeof handleBox(direction) === 'number') {
			console.log(handleBox(direction), handleBox(direction, false));
		}
	};
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, sideId) => (
					<BoxWrapper key={sideId} direction={direction} $isLast={isLast}>
						<BoxHover
							onClick={() => {
								onBoxClick(sideId);
							}}
							direction={direction}
							$isSelected={
								!!selected[direction].filter(
									(item) => item.border === borderId && item.side === sideId
								)[0]?.isSelected
							}
						>
							<FakeHover />
							<BoxSide />
						</BoxHover>
					</BoxWrapper>
				))}
		</>
	);
};

interface borderBoxProps extends directionInterface {
	setSelected: setSelected;
	selected: selected;
	setBoxes: setBoxes;
	boxes: boxes;
}

const BorderBox = ({
	direction,
	selected,
	boxes,
	setSelected,
	setBoxes,
}: borderBoxProps) => {
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, borderId) => (
					<BoxStyle key={borderId} direction={direction}>
						<BoxCollection
							direction={direction}
							borderId={borderId}
							selected={selected}
							boxes={boxes}
							setSelected={setSelected}
							setBoxes={setBoxes}
						/>
						{borderId === 4 ? (
							<BoxCollection
								direction={direction}
								isLast={borderId === 4}
								borderId={borderId + 1}
								selected={selected}
								boxes={boxes}
								setSelected={setSelected}
								setBoxes={setBoxes}
							/>
						) : null}
					</BoxStyle>
				))}
		</>
	);
};

interface borderState {
	border: number;
	side: number;
	isSelected: boolean;
}

interface selected {
	vertical: borderState[];
	horizental: borderState[];
}

type boxes = Array<{
	id: number;
	isPartialSurrounded: boolean;
	isSurrounded: boolean;
}>;

const Board = () => {
	const [selected, setSelected] = useState<selected>({
		vertical: [],
		horizental: [],
	});
	const [boxes, setBoxes] = useState<
		Array<{ id: number; isPartialSurrounded: boolean; isSurrounded: boolean }>
	>(
		Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
		}))
	);
	useEffect(() => {
		/* for (let i = 0; i++; i < selected.horizental.length) {} */
	}, [selected]);

	return (
		<BoardLayout>
			<BoardItemsContainer>
				{boxes.map((box, id) =>
					id < 5 || id > 20 || id % 5 === 0 || id % 5 === 4 ? (
						<Boxes key={box.id} $isSurrounded={box.isSurrounded}>
							{box.id}
						</Boxes>
					) : (
						<Boxes key={box.id} $isSurrounded={box.isSurrounded}>
							{box.id}
						</Boxes>
					)
				)}
				<BoardBordersContainer $borderDirection="column">
					<BoardBordersContainer $borderDirection="row">
						<BorderBox
							direction="vertical"
							setSelected={setSelected}
							selected={selected}
							setBoxes={setBoxes}
							boxes={boxes}
						/>
					</BoardBordersContainer>
					<BorderBox
						direction="horizental"
						setSelected={setSelected}
						selected={selected}
						setBoxes={setBoxes}
						boxes={boxes}
					/>
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
