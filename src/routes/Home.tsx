import React from 'react';
import styled from 'styled-components';
import { isElementInNestedArray, sortByOrder } from '../libs/utils';
import { HomeProvider, useHomeContext } from './HomeContext';

const colors = {
	player1: {
		noneActiveBorder: '#1696eb',
		noneActiveBox: '#1244db',
		activeBox: '#1696eb',
	},
	player2: {
		noneActiveBorder: '#73dd85',
		noneActiveBox: '#1bc237',
		activeBox: '#73dd85',
	},
	common: { noneActiveBox: '#1696eb' },
};

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

const BoardLayout = styled.div<BoardLayoutProps>`
	position: relative;
	background-color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
	display: flex;
	justify-content: space-between;
	height: 100%;
`;

const BoardItemsContainer = styled.div`
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	display: grid;
	height: 100%;
	aspect-ratio: 1;
`;

const Boxes = styled.div<BoxesProps>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => {
		if (props.$isSurrounded) {
			return colors[props.$currentPlayer].activeBox;
		} else {
			return 'transparent';
		}
	}};
`;

const BoardBordersContainer = styled.div<BoardBordersContainerProps>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: ${(props) => props.$borderDirection};
	justify-content: space-between;
`;

const BoxStyle = styled.div<directionInterface>`
	position: relative;
	width: ${(props) => (props.direction === 'horizontal' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizontal' ? '20%' : '100%')};
	flex-direction: ${(props) =>
		props.direction === 'horizontal' ? 'row' : 'column'};
	display: flex;
	flex-wrap: wrap;
`;

const BoxWrapper = styled.div<BoxWrapperProps>`
	font-size: 1rem;
	color: #101010;
	width: ${(props) => (props.direction === 'horizontal' ? '20%' : 0)};
	height: ${(props) => (props.direction === 'horizontal' ? 0 : '20%')};
	position: relative;
	align-self: ${(props) => (props.$isLast ? 'flex-end' : 'flex-start')};
`;

const FakeHover = styled.div`
	position: absolute;
	background-color: inherit;
	pointer-events: none;
`;

const BoxSide = styled.div`
	border-width: 2px;
	border-style: solid;
	border-color: inherit;
	position: absolute;
	pointer-events: none;
`;

const BoxHover = styled.div<BoxHoverProps>`
	width: ${(props) =>
		props.direction === 'horizontal' ? 'calc(100% - 40px)' : '40px'};
	height: ${(props) =>
		props.direction === 'horizontal' ? '40px' : 'calc(100% - 40px)'};
	position: absolute;
	transform: ${(props) =>
		props.direction === 'horizontal' ? 'translateY(-50%)' : 'translateX(-50%)'};
	top: ${(props) => (props.direction === 'horizontal' ? 0 : '20px')};
	left: ${(props) => (props.direction === 'horizontal' ? '20px' : 0)};
	z-index: 1;
	display: flex;
	align-items: ${(props) =>
		props.direction === 'horizontal' ? 'center' : 'center'};
	justify-content: ${(props) =>
		props.direction === 'horizontal' ? 'center' : 'center'};
	border-color: ${(props) => {
		if (props.$isSelected) {
			return props.$owner === 'player1' ? 'orange' : 'yellow';
		} else {
			return colors[props.$currentPlayer].noneActiveBorder;
		}
	}};
	z-index: ${(props) => (props.$isSelected ? 2 : 1)};
	&:hover {
		background-color: blueviolet;
		border-color: green;
		z-index: 3;
	}
	${FakeHover} {
		width: ${(props) =>
			props.direction === 'horizontal' ? 'calc(100% + 44px)' : '100%'};
		height: ${(props) =>
			props.direction === 'horizontal' ? '100%' : 'calc(100% + 44px)'};
	}
	${BoxSide} {
		width: ${(props) =>
			props.direction === 'horizontal' ? 'calc(100% + 44px)' : 'auto'};
		height: ${(props) =>
			props.direction === 'horizontal' ? 'auto' : 'calc(100% + 44px)'};

		left: ${(props) => (props.direction === 'horizontal' ? '-22px' : 'auto')};
		top: ${(props) => (props.direction === 'horizontal' ? 'auto' : '-22px')};
	}
`;

const BoxCollection = ({
	direction,
	borderId,
	isLast = false,
}: boxCollectionProps) => {
	const {
		boxes,
		setBoxes,
		selected,
		setSelected,
		currentPlayer,
		setCurrentPlayer,
		players,
		setPlayers,
	} = useHomeContext();
	const onBoxClick = (sideId: number) => {
		if (
			selected[direction].find(
				(item) => item.border === borderId && item.side === sideId
			)
		)
			return;
		console.log('border = ' + borderId, 'side = ' + sideId, boxes);
		const boxLocation = (
			direction: direction,
			isUpPos: boolean,
			border: number = borderId,
			side: number = sideId,
			option: number = 0
		) => {
			if ((border === 0 && isUpPos) || (border === 5 && !isUpPos)) {
				return false;
			} else if (direction === 'horizontal') {
				return (border - (isUpPos ? 1 : 0)) * 5 + side + option;
			} else if (direction === 'vertical') {
				return side * 5 + border - (isUpPos ? 1 : 0) + option;
			} else {
				return false;
			}
		};

		const formattedSelected: selected =
			selected[direction].filter(
				(item) => item.border === borderId && item.side === sideId
			).length === 0
				? {
						...selected,
						[direction]: [
							...selected[direction],
							{
								border: borderId,
								side: sideId,
								isSelected: true,
								owner: currentPlayer,
							} /* satisfies === 중복 검사 */ satisfies borderState,
						],
				  }
				: selected;

		const findExistSideSelected = (sidePos: 'left' | 'right') => [
			...formattedSelected[
				direction === 'horizontal' ? 'vertical' : 'horizontal'
			].filter(
				(item) =>
					item.owner === currentPlayer &&
					item.border ===
						sideId +
							(direction === 'horizontal'
								? sidePos === 'left'
									? 0
									: 1
								: sidePos === 'left'
								? 1
								: 0) &&
					(item.side === borderId - 1 || item.side === borderId)
			),
			...formattedSelected[direction].filter(
				(item) =>
					item.owner === currentPlayer &&
					item.border === borderId &&
					item.side ===
						sideId +
							(direction === 'horizontal'
								? sidePos === 'left'
									? -1
									: 1
								: sidePos === 'left'
								? 1
								: -1)
			),
		];

		const findClosedBoxByDirection = (direction: direction) => {
			const isHorizontal = direction === 'horizontal';
			return Array.from({ length: 5 }, (_, id) => {
				const borders = formattedSelected[
					isHorizontal ? 'horizontal' : 'vertical'
				]
					.filter((item) => item.side === id && item.owner === currentPlayer)
					.sort((a, b) => a.border - b.border);
				return borders.length > 1
					? Array.from({ length: borders.length - 1 }, (_, idx) =>
							Array.from(
								{ length: borders[idx + 1].border - borders[idx].border },
								(_, index) => {
									return (
										(borders[idx].border + index) * (isHorizontal ? 5 : 1) +
										borders[idx].side * (isHorizontal ? 1 : 5)
									);
								}
							)
					  )
					: [];
			})
				.flat()
				.filter((item) => !!item);
		};

		/**
		 * 서로 다른 두 개의 중첩된 배열에서 요소간에 연결되며 겹치는 배열을 구하는 함수 초안
		 *
		 * ex) arr1 = [[1], [2, 3], [4]] , arr2 = [[1, 2], [3], [4, 5]]일 때,
		 *
		 * fn([1],arr2)를 실행하면 lists = [1], [2, 3] 이 나오고 lists2 = [1, 2], [3] 이 나올 수 있도록.
		 *
		 * ps. 시발거
		 *  */

		const getEnclosedBox = (closedBox: number[], initDirection: direction) => {
			const horizontalClosedBoxes: closedBoxes = {
				arr: findClosedBoxByDirection('horizontal'),
				label: 'horizontal',
			};
			const verticalClosedBoxes: closedBoxes = {
				arr: findClosedBoxByDirection('vertical'),
				label: 'vertical',
			};

			const result: getEnclosedBoxResult = {
				horizontal: [],
				vertical: [],
			};

			const addEnclosedBoxesRecursive = (
				closedBox: number[],
				boxesObject: {
					arr: nestedArray<number>;
					label: direction;
				}
			) => {
				const resultIsIncluded = isElementInNestedArray(
					closedBox,
					boxesObject.arr
				);
				if (resultIsIncluded.length > 0) {
					resultIsIncluded.forEach((el) => {
						if (!result[boxesObject.label].includes(el)) {
							result[boxesObject.label] = [...result[boxesObject.label], el];
							addEnclosedBoxesRecursive(
								el,
								boxesObject.label === 'horizontal'
									? verticalClosedBoxes
									: horizontalClosedBoxes
							);
						}
					});
				} else {
					return false;
				}
			};

			addEnclosedBoxesRecursive(
				closedBox,
				initDirection === 'horizontal'
					? horizontalClosedBoxes
					: verticalClosedBoxes
			);

			return {
				horizontal: sortByOrder(result.horizontal.flat(), 'ascending'),
				vertical: sortByOrder(result.vertical.flat(), 'ascending'),
			};
		};

		/* const deepNewBoxes: boxes = JSON.parse(JSON.stringify(boxes)); 이 방식의 깊은 복사는 undefined를 제거해버림 */
		const deepNewBoxes: boxes = boxes.map((item) => ({ ...item }));

		if (
			findExistSideSelected('left').length > 0 &&
			findExistSideSelected('right').length > 0
		) {
			const enclosedBoxes = findClosedBoxByDirection('horizontal').map((item) =>
				getEnclosedBox(
					item,
					direction === 'horizontal' ? 'vertical' : 'horizontal'
				)
			);
			for (const box of enclosedBoxes) {
				const surroundedBoxCount = box.horizontal.reduce(
					(count, id) => (boxes[id].isSurrounded ? count + 1 : count),
					0
				);
				if (
					JSON.stringify(box.horizontal) === JSON.stringify(box.vertical) &&
					surroundedBoxCount < box.horizontal.length &&
					box.horizontal.filter(
						(boxEl) =>
							boxes[boxEl].owner !== currentPlayer &&
							boxes[boxEl].owner !== undefined
					).length === 0
				) {
					box.horizontal.forEach((item) => {
						deepNewBoxes[item].isSurrounded = true;
						deepNewBoxes[item].owner = currentPlayer;
					});
				}
			}
		}

		const isMergeableSelected = (direction: direction) =>
			formattedSelected[direction].filter((item) => {
				const upBox = boxLocation(direction, true, item.border, item.side);
				const downBox = boxLocation(direction, false, item.border, item.side);
				if (
					upBox &&
					downBox &&
					deepNewBoxes[upBox].isSurrounded &&
					deepNewBoxes[downBox].isSurrounded &&
					deepNewBoxes[upBox].owner === currentPlayer &&
					deepNewBoxes[downBox].owner === currentPlayer
				) {
					return false;
				}
				return true;
			});

		const resultSelected = {
			horizontal: isMergeableSelected('horizontal'),
			vertical: isMergeableSelected('vertical'),
		};

		setSelected(resultSelected);
		setBoxes(deepNewBoxes);
		setPlayers((p) => {
			const newPlayers = { ...p };
			newPlayers[currentPlayer].boxCount = deepNewBoxes.filter(
				(item) => item.isSurrounded
			).length;
			return newPlayers;
		});
		setCurrentPlayer((p) => (p === 'player1' ? 'player2' : 'player1'));

		/* why doesn't TypeGuard work when using a func return instead a variable? */
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
							$currentPlayer={currentPlayer}
							$owner={
								selected[direction].filter(
									(item) => item.border === borderId && item.side === sideId
								)[0]?.owner
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

const BorderBox = ({ direction }: borderBoxProps) => {
	return (
		<>
			{Array(5)
				.fill(undefined)
				.map((_, borderId) => (
					<BoxStyle key={borderId} direction={direction}>
						<BoxCollection direction={direction} borderId={borderId} />
						{borderId === 4 ? (
							<BoxCollection
								direction={direction}
								isLast={borderId === 4}
								borderId={borderId + 1}
							/>
						) : null}
					</BoxStyle>
				))}
		</>
	);
};

const Board = () => {
	const { boxes, currentPlayer, players } = useHomeContext();
	return (
		<BoardLayout $currentPlayer={currentPlayer}>
			<div>
				{players.player1.name} <br />
				rate : {boxes.filter((box) => box.isSurrounded).length}
			</div>
			<BoardItemsContainer>
				{boxes.map((box, id) =>
					id < 5 || id > 20 || id % 5 === 0 || id % 5 === 4 ? (
						<Boxes
							key={box.id}
							$isSurrounded={box.isSurrounded}
							$currentPlayer={currentPlayer}
						>
							{box.id}
						</Boxes>
					) : (
						<Boxes
							key={box.id}
							$isSurrounded={box.isSurrounded}
							$currentPlayer={currentPlayer}
						>
							{box.id}
						</Boxes>
					)
				)}
				<BoardBordersContainer $borderDirection="column">
					<BoardBordersContainer $borderDirection="row">
						<BorderBox direction="vertical" />
					</BoardBordersContainer>
					<BorderBox direction="horizontal" />
				</BoardBordersContainer>
			</BoardItemsContainer>
			<div>
				{players.player2.name}
				<br />
				rate : {boxes.filter((box) => box.isSurrounded).length}
			</div>
		</BoardLayout>
	);
};

const Home = () => {
	return (
		<HomeProvider>
			<Layout>
				The BorderGame
				<Board />
			</Layout>
		</HomeProvider>
	);
};

export default Home;
