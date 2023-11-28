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
		console.log('border = ' + borderId, 'side = ' + sideId, boxes);

		const boxLocation = (
			direction: direction,
			isUpPos: boolean,
			option: number = 0,
			border: number = borderId,
			side: number = sideId
		) => {
			if ((border === 0 && isUpPos) || (border === 5 && !isUpPos)) {
				return 'notExist';
			} else if (direction === 'horizental') {
				return (border - (isUpPos ? 1 : 0)) * 5 + side + option;
			} else if (direction === 'vertical') {
				return side * 5 + border - (isUpPos ? 1 : 0) + option;
			} else {
				return 'notExist';
			}
		};

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

		const handleBox: (
			kind: direction,
			isUpPos: boolean
		) => {
			boxIndex: number | undefined | 'notExist';
			state: 'isSurrounded' | 'isPartialSurrounded' | 'notSurrounded';
		} = (kind, isUpPos = true) => {
			const processHorizental = () => ({
				left: selected[
					kind === 'horizental' ? 'vertical' : 'horizental'
				].filter(
					(item) =>
						(kind === 'horizental'
							? item.border === sideId
							: item.border === sideId + 1) &&
						item.side === (isUpPos ? borderId - 1 : borderId)
				)[0],
				right: selected[
					kind === 'horizental' ? 'vertical' : 'horizental'
				].filter(
					(item) =>
						(kind === 'horizental'
							? item.border === sideId + 1
							: item.border === sideId) &&
						item.side === (isUpPos ? borderId - 1 : borderId)
				)[0],
			});
			const processVertical = () =>
				selected[kind].filter(
					(item) =>
						item.border === (isUpPos ? borderId - 1 : borderId + 1) &&
						item.side === sideId
				)[0];
			/* solved */
			const isBoxContacting = (
				borderCondition: borderState,
				truePart: number,
				falsePart: number
			) => {
				return (
					borderCondition ||
					boxes.filter(
						(item) =>
							item.id ===
							boxLocation(
								direction,
								isUpPos,
								direction === 'horizental' ? truePart : falsePart
							)
					)[0]?.isPartialSurrounded
				);
			};

			/* const isLeftHorizentalSurrounded = () => {
				return (
					processHorizental().left ||
					boxes.filter(
						(item) =>
							item.id ===
							boxLocation(
								direction,
								isUpPos,
								direction === 'horizental' ? -1 : 5
							)
					)[0]?.isPartialSurrounded
				);
			};

			const isRightHorizentalSurrounded = () => {
				return (
					processHorizental().right ||
					boxes.filter(
						(item) =>
							item.id ===
							boxLocation(
								direction,
								isUpPos,
								direction === 'horizental' ? 1 : -5
							)
					)[0]?.isPartialSurrounded
				);
			};

			const isVerticalSurrounded = () => {
				return (
					processVertical() ||
					boxes.filter(
						(item) =>
							item.id ===
							boxLocation(
								direction,
								isUpPos,
								direction === 'horizental'
									? (isUpPos
										? -5
										: 5)
									: (isUpPos
									? -1
									: 1)
							)
					)[0].isPartialSurrounded
				);
			}; */

			/* console.log(processHorizental(), processVertical()); */

			const contactingResult = {
				vertical: isBoxContacting(
					processVertical(),
					isUpPos ? -5 : 5,
					isUpPos ? -1 : 1
				),
				left: isBoxContacting(processHorizental().left, -1, 5),
				right: isBoxContacting(processHorizental().right, 1, -5),
			};

			if (
				/* When the Box is Surrounded */
				contactingResult.vertical &&
				contactingResult.left &&
				contactingResult.right
			) {
				console.log('its Surrounded');
				return {
					state: 'isSurrounded',
					boxIndex: boxLocation(direction, isUpPos),
				};
			} else if (
				/** When the Box is PartialSurrounded */
				Object.values(contactingResult).reduce(
					(count, el) => count + (el ? 1 : 0),
					0
				) === 2
			) {
				console.log('its PartialSurrounded');
				return {
					state: 'isPartialSurrounded',
					boxIndex: boxLocation(direction, isUpPos),
				};
			} else {
				return {
					state: 'notSurrounded',
					boxIndex: undefined,
				};
			}
		};

		const updateBoxState = (
			index: number | 'notExist',
			state: 'isSurrounded' | 'isPartialSurrounded'
		) => {
			index === 'notExist' ||
				setBoxes((p) => {
					const newBoxes = [...p];
					newBoxes[index][state] = true;
					return newBoxes;
				});
		};

		handleSelected(direction);

		/* why doesn't TypeGuard work when using a func return instead a variable? */
		const handleBoxState = {
			up: handleBox(direction, true).state,
			down: handleBox(direction, false).state,
		};

		/* When Upside Border Clicked */
		if (handleBoxState.up !== 'notSurrounded') {
			updateBoxState(
				handleBox(direction, true).boxIndex as number,
				handleBoxState.up
			);
		}

		/* When Downside Border Clicked */
		if (handleBoxState.down !== 'notSurrounded') {
			updateBoxState(
				handleBox(direction, false).boxIndex as number,
				handleBoxState.down
			);
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
