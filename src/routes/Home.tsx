import React from 'react';
import styled from 'styled-components';
import { isElementInNestedArray, sortByOrder } from '../libs/utils';
import { HomeProvider, useHomeContext } from './HomeContext';

const colors = {
	player1: {
		noneActiveBorder: '#1696eb',
		noneActiveBox: '#1a4de6',
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
	@media screen and (max-width: 1024px) {
		display: flex;
		flex-direction: column;
		padding: 80px 0 40px 0;
	}
`;

const BoardLayout = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	height: auto;
	@media screen and (max-width: 1024px) {
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}
`;

const PlayerCardStyle = styled.div<PlayerCardStyleProps>`
	max-width: 400px;
	width: 100%;
	background-color: ${(props) =>
		props.$player === 'player1'
			? colors.player1.noneActiveBox
			: colors.player2.noneActiveBox};
	margin: ${(props) =>
		props.$player === 'player1' ? '0 40px 0 0' : '0 0 0 40px'};
	padding: 12px 24px;
	font-size: 4vw;
	h3 {
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
	}
	@media screen and (max-width: 1024px) {
		margin: ${(props) =>
			props.$player === 'player1' ? '0 0 20px 0' : '20px 0 0 0 '};
		max-width: 100%;
		display: flex;
		justify-content: space-between;
	}
`;

const BoardItemsContainer = styled.div<BoardItemsContainerProps>`
	position: relative;
	grid-template-columns: repeat(5, 1fr);
	background-color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
	display: grid;
	width: 35vw;
	height: 35vw;
	aspect-ratio: 1;
	@media screen and (max-width: 1024px) {
		height: 100%;
		width: auto;
		aspect-ratio: 1;
	}
`;

const Boxes = styled.div<BoxesProps>`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => {
		if (props.$isSurrounded && props.$owner) {
			return colors[props.$owner].activeBox;
		} else {
			return 'transparent';
		}
	}};
	font-size: 3vw;
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
		if (props.$isSelected && !props.$isMergeable) {
			return props.$owner === 'player1'
				? props.$currentPlayer === 'player1'
					? 'red'
					: colors.player1.noneActiveBox
				: props.$currentPlayer === 'player2'
				? 'red'
				: colors.player2.noneActiveBox;
		} else if (props.$isMergeable) {
			return colors[props.$owner].noneActiveBorder;
		} else {
			return colors[props.$currentPlayer].noneActiveBorder;
		}
	}};
	z-index: ${(props) => (props.$isSelected ? 2 : 1)};
	&:hover {
		background-color: ${(props) =>
			props.$isMergeable ? 'auto' : 'blueviolet'};
		border-color: ${(props) => (props.$isMergeable ? 'auto' : 'green')};
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
			props.direction === 'horizontal'
				? props.$isMergeable
					? 'calc(100% + 36px)'
					: 'calc(100% + 44px)'
				: 'auto'};
		height: ${(props) =>
			props.direction === 'horizontal'
				? 'auto'
				: props.$isMergeable
				? 'calc(100% + 36px)'
				: 'calc(100% + 44px)'};
		left: ${(props) =>
			props.direction === 'horizontal'
				? props.$isMergeable
					? '-18px'
					: '-22px'
				: 'auto'};
		top: ${(props) =>
			props.direction === 'horizontal'
				? 'auto'
				: props.$isMergeable
				? '-18px'
				: '-22px'};
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
		// console.log('border = ' + borderId, 'side = ' + sideId, boxes, selected);
		const borderToBox = (
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

		const boxToborder = (
			boxIndex: number,
			direction: 'left' | 'right' | 'up' | 'down',
			isSelected: boolean = false,
			isMergeable: boolean = false,
			owner: currentPlayer = currentPlayer
		) => {
			const resultSelected: (opt: number) => borderState = (opt) => {
				const remainder = boxIndex % 5;
				const quotient = Math.floor(boxIndex / 5);
				const isHorizontal = direction === 'left' || direction === 'right';
				const border = (isHorizontal ? remainder : quotient) + opt;
				const side = isHorizontal ? quotient : remainder;
				const existSelected = selected[
					isHorizontal ? 'vertical' : 'horizontal'
				].find((item) => item.border === border && item.side === side);
				if (existSelected) {
					return existSelected;
				} else {
					return {
						border,
						side,
						isSelected,
						owner,
						isMergeable,
					};
				}
			};
			switch (true) {
				case direction === 'left' || direction === 'up':
					return resultSelected(0);
				case direction === 'right' || direction === 'down':
					return resultSelected(1);
			}
		};

		const formattedSelected: selected = !selected[direction].find(
			(item) => item.border === borderId && item.side === sideId
		)
			? {
					...selected,
					[direction]: [
						...selected[direction],
						{
							border: borderId,
							side: sideId,
							isSelected: true,
							owner: currentPlayer,
							isMergeable: false,
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
				const isBoxesIncludeOtherPlayers = box.horizontal.find(
					(boxEl) =>
						boxes[boxEl].owner ===
						(currentPlayer === 'player1' ? 'player2' : 'player1')
				);
				/* 새로 enclosed상태가 된 박스들 간의 borderMerge */
				const selectedMerge = () => {
					const mergeableSelected: selected = { horizontal: [], vertical: [] };
					for (const boxIndex of box.horizontal) {
						const rightBorder = boxToborder(boxIndex, 'right', true, true);
						const downBorder = boxToborder(boxIndex, 'down', true, true);
						if (box.horizontal.includes(boxIndex + 1) && rightBorder) {
							mergeableSelected.vertical.push(rightBorder);
						}
						if (box.horizontal.includes(boxIndex + 5) && downBorder) {
							mergeableSelected.horizontal.push(downBorder);
						}
					}
					return mergeableSelected;
				};
				if (
					JSON.stringify(box.horizontal) === JSON.stringify(box.vertical) &&
					surroundedBoxCount < box.horizontal.length &&
					!isBoxesIncludeOtherPlayers
				) {
					box.horizontal.forEach((item) => {
						deepNewBoxes[item].isSurrounded = true;
						deepNewBoxes[item].owner = currentPlayer;
					});
					console.log(selectedMerge());
					formattedSelected.horizontal = [
						...new Set([
							...formattedSelected.horizontal,
							...selectedMerge().horizontal,
						]),
					];
					formattedSelected.vertical = [
						...new Set([
							...formattedSelected.vertical,
							...selectedMerge().vertical,
						]),
					];
				}
			}
		}

		/* 이미 존재하는 박스와 새로 연결되는 박스들 간의 borderMerge */
		const isMergeableSelected = (direction: direction) =>
			formattedSelected[direction].map((item) => {
				const upBox = borderToBox(direction, true, item.border, item.side);
				const downBox = borderToBox(direction, false, item.border, item.side);
				if (
					/* 여기서 upBox !== false를 해줘야 upBox가 0일때 true를 반환해야 하지만 0자체가 falsy이기 때문에 false로 판단되는 버그를 방지할 수 있다. */
					upBox !== false &&
					downBox !== false &&
					deepNewBoxes[upBox].isSurrounded &&
					deepNewBoxes[downBox].isSurrounded &&
					deepNewBoxes[upBox].owner === currentPlayer &&
					deepNewBoxes[downBox].owner === currentPlayer
				) {
					return { ...item, isMergeable: true };
				}
				return item;
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
				.map((_, sideId) => {
					const foundSelected = selected[direction].find(
						(item) => item.border === borderId && item.side === sideId
					);
					return (
						<BoxWrapper key={sideId} direction={direction} $isLast={isLast}>
							<BoxHover
								onClick={() => {
									onBoxClick(sideId);
								}}
								direction={direction}
								$isSelected={!!foundSelected?.isSelected}
								$currentPlayer={currentPlayer}
								$owner={foundSelected ? foundSelected.owner : currentPlayer}
								$isMergeable={foundSelected ? foundSelected.isMergeable : false}
							>
								<FakeHover />
								<BoxSide />
							</BoxHover>
						</BoxWrapper>
					);
				})}
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

const PlayerCard = ({ player }: { player: currentPlayer }) => {
	const { players, boxes } = useHomeContext();
	return (
		<PlayerCardStyle $player={player}>
			{players[player].name} <br />
			<h3>
				score :{' '}
				{boxes.filter((box) => box.isSurrounded && box.owner === player).length}
			</h3>
		</PlayerCardStyle>
	);
};

const Board = () => {
	const { boxes, currentPlayer, players } = useHomeContext();
	return (
		<BoardLayout>
			<PlayerCard player="player1" />
			<BoardItemsContainer $currentPlayer={currentPlayer}>
				{boxes.map((box, id) =>
					id < 5 || id > 20 || id % 5 === 0 || id % 5 === 4 ? (
						<Boxes
							key={box.id}
							$isSurrounded={box.isSurrounded}
							$currentPlayer={currentPlayer}
							$owner={box.owner}
						>
							{box.id}
						</Boxes>
					) : (
						<Boxes
							key={box.id}
							$isSurrounded={box.isSurrounded}
							$currentPlayer={currentPlayer}
							$owner={box.owner}
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
			<PlayerCard player="player2" />
		</BoardLayout>
	);
};

const Home = () => {
	return (
		<HomeProvider>
			<Layout>
				<div>The BorderGame</div>
				<Board />
			</Layout>
		</HomeProvider>
	);
};

export default Home;
