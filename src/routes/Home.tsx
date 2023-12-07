import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import usePrevious from '../hooks/usePrevious';
import { isElementInNestedArray, sortByOrder } from '../libs/utils';

interface directionInterface {
	direction: direction;
}

type direction = 'horizontal' | 'vertical';

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
	width: ${(props) => (props.direction === 'horizontal' ? '100%' : '20%')};
	height: ${(props) => (props.direction === 'horizontal' ? '20%' : '100%')};
	flex-direction: ${(props) =>
		props.direction === 'horizontal' ? 'row' : 'column'};
	display: flex;
	flex-wrap: wrap;
`;

const BoxWrapper = styled.div<directionInterface & { $isLast: boolean }>`
	font-size: 1rem;
	color: #101010;
	width: ${(props) => (props.direction === 'horizontal' ? '20%' : 0)};
	height: ${(props) => (props.direction === 'horizontal' ? 0 : '20%')};
	position: relative;
	align-self: ${(props) => (props.$isLast ? 'flex-end' : 'flex-start')};
`;

const FakeHover = styled.div``;

const BoxSide = styled.div``;

const BoxHover = styled.div<directionInterface & { $isSelected: boolean }>`
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
			props.direction === 'horizontal' ? 'calc(100% + 44px)' : '100%'};
		height: ${(props) =>
			props.direction === 'horizontal' ? '100%' : 'calc(100% + 44px)'};
		background-color: inherit;
		pointer-events: none;
	}
	${BoxSide} {
		width: ${(props) =>
			props.direction === 'horizontal' ? 'calc(100% + 44px)' : 'auto'};
		height: ${(props) =>
			props.direction === 'horizontal' ? 'auto' : 'calc(100% + 44px)'};
		border-width: 2px;
		border-style: solid;
		border-color: inherit;
		position: absolute;
		left: ${(props) => (props.direction === 'horizontal' ? '-22px' : 'auto')};
		top: ${(props) => (props.direction === 'horizontal' ? 'auto' : '-22px')};
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
			} else if (direction === 'horizontal') {
				return (border - (isUpPos ? 1 : 0)) * 5 + side + option;
			} else if (direction === 'vertical') {
				return side * 5 + border - (isUpPos ? 1 : 0) + option;
			} else {
				return 'notExist';
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
							{ border: borderId, side: sideId, isSelected: true },
						],
				  }
				: selected;

		const getFilterdSelected = (direction: 'left' | 'right') => [
			...formattedSelected.vertical.filter(
				(item) =>
					item.border === sideId + (direction === 'left' ? 0 : 1) &&
					(item.side === borderId - 1 || item.side === borderId)
			),
			...formattedSelected.horizontal.filter(
				(item) =>
					item.border === borderId &&
					item.side === sideId + (direction === 'left' ? -1 : +1)
			),
		];

		const findClosedBoxByDirection = (direction: direction) => {
			const isHorizontal = direction === 'horizontal';
			return Array.from({ length: 5 }, (_, id) => {
				const borders = formattedSelected[
					isHorizontal ? 'horizontal' : 'vertical'
				]
					.filter((item) => item.side === id)
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
			/* 파라미터로 전달하든 함수를 만들든 아래 코드 수정해서 순수함수로 바꾸기 */
			const horizontalClosedBoxes: {
				arr: number[][];
				label: 'horizontal' | 'vertical';
			} = {
				arr: findClosedBoxByDirection('horizontal'),
				label: 'horizontal',
			};
			const verticalClosedBoxes: {
				arr: number[][];
				label: 'horizontal' | 'vertical';
			} = {
				arr: findClosedBoxByDirection('vertical'),
				label: 'vertical',
			};

			const result: { horizontal: number[][]; vertical: number[][] } = {
				horizontal: [],
				vertical: [],
			};

			const addEnclosedBoxesRecursive = (
				closedBox: number[],
				boxesObject: {
					arr: number[][];
					label: 'horizontal' | 'vertical';
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

		if (
			getFilterdSelected('left').length > 0 &&
			getFilterdSelected('right').length > 0
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
					surroundedBoxCount < box.horizontal.length
				) {
					setBoxes((p) => {
						const newBoxes = [...p];
						box.horizontal.forEach((item) => {
							newBoxes[item].isSurrounded = true;
						});
						return newBoxes;
					});
				}
			}
		}

		setSelected(formattedSelected);

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
	horizontal: borderState[];
}

type boxes = Array<{
	id: number;
	isPartialSurrounded: boolean;
	isSurrounded: boolean;
}>;

const Board = () => {
	const [selected, setSelected] = useState<selected>({
		vertical: [],
		horizontal: [],
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
						direction="horizontal"
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
