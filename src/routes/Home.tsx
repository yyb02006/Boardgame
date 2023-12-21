import React from 'react';
import styled from 'styled-components';
import { isElementInNestedArray, sortByOrder } from '../libs/utils';
import { HomeProvider, useHomeContext } from './HomeContext';

const colors = {
	player1: {
		noneActiveBorder: '#1696eb',
		noneActiveBox: '#1a4de6',
		activeBox: '#1696eb',
		emphaticColor: '#00ffdd',
	},
	player2: {
		noneActiveBorder: '#73dd85',
		noneActiveBox: '#1bc237',
		activeBox: '#73dd85',
		emphaticColor: '#a1ff09',
	},
	common: { noneActiveBorder: '#808080', activeBorder: '#e48100' },
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

const Turn = styled.span``;

const Player = styled.div<PlayerProps>`
	margin-bottom: 16px;
	color: ${(props) => colors[props.$currentPlayer].noneActiveBox};
`;

const TitleContainer = styled.div`
	display: flex;
	${Turn} {
		color: ${colors.common.activeBorder};
	}
	@media screen and (max-width: 1024px) {
		font-size: 2rem;
		margin-left: 24px;
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

const BoardItemsWrapper = styled.div`
	height: 100%;
	max-height: 100vw;
	aspect-ratio: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	@media screen and (max-width: 1024px) {
		padding: 24px 0;
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
					? colors.common.activeBorder
					: colors.player1.noneActiveBox
				: props.$currentPlayer === 'player2'
				? colors.common.activeBorder
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
			props.$isMergeable ? 'auto' : colors.common.activeBorder};
		border-color: ${(props) =>
			props.$isMergeable ? 'auto' : colors[props.$currentPlayer].noneActiveBox};
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
	const otherPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
	const otherDirection = direction === 'horizontal' ? 'vertical' : 'horizontal';
	const onBoxClick = (sideId: number) => {
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

		const findSideSelected: (
			selectedBorderId: number,
			selectedSideId: number,
			sidePos: 'left' | 'right',
			sideDireciton: direction
		) => { top: borderState; middle: borderState; bottom: borderState } = (
			selectedBorderId,
			selectedSideId,
			sidePos,
			selectedDireciton
		) => {
			return {
				top: {
					border:
						selectedSideId +
						(selectedDireciton === 'horizontal'
							? sidePos === 'left'
								? 0
								: 1
							: sidePos === 'left'
							? 1
							: 0),
					side: selectedBorderId - 1,
					isSelected: true,
					owner: currentPlayer,
					isMergeable: false,
				},
				middle: {
					border: selectedBorderId,
					side:
						selectedSideId +
						(selectedDireciton === 'horizontal'
							? sidePos === 'left'
								? -1
								: 1
							: sidePos === 'left'
							? 1
							: -1),
					isSelected: true,
					owner: currentPlayer,
					isMergeable: false,
				},
				bottom: {
					border:
						selectedSideId +
						(selectedDireciton === 'horizontal'
							? sidePos === 'left'
								? 0
								: 1
							: sidePos === 'left'
							? 1
							: 0),
					side: selectedBorderId,
					isSelected: true,
					owner: currentPlayer,
					isMergeable: false,
				},
			};
		};

		const findExistSideSelected = (
			borderId: number,
			sideId: number,
			sidePos: 'left' | 'right',
			owner: 'current' | 'other' | 'all',
			selectedDirection: direction = direction
		) => [
			...formattedSelected[
				selectedDirection === 'horizontal' ? 'vertical' : 'horizontal'
			]
				.filter(
					(item) =>
						(owner === 'current'
							? item.owner === currentPlayer
							: owner === 'other'
							? item.owner === otherPlayer
							: true) &&
						item.border ===
							sideId +
								(selectedDirection === 'horizontal'
									? sidePos === 'left'
										? 0
										: 1
									: sidePos === 'left'
									? 1
									: 0) &&
						(item.side === borderId - 1 || item.side === borderId)
				)
				.map((item) => ({
					...item,
					direction:
						selectedDirection === 'horizontal' ? 'vertical' : 'horizontal',
				})),
			...formattedSelected[selectedDirection]
				.filter(
					(item) =>
						(owner === 'current'
							? item.owner === currentPlayer
							: owner === 'other'
							? item.owner === otherPlayer
							: true) &&
						item.border === borderId &&
						item.side ===
							sideId +
								(selectedDirection === 'horizontal'
									? sidePos === 'left'
										? -1
										: 1
									: sidePos === 'left'
									? 1
									: -1)
				)
				.map((item) => ({ ...item, direction: selectedDirection })),
		];

		/* ??와 ||는 서로 완전히 같은 목적으로 사용할 수 없음 */
		const breakOnClickCondition =
			/* 같은 자리에 이미 클릭된 border가 있을 경우  */
			!!selected[direction].find(
				(item) => item.border === borderId && item.side === sideId
			) ||
			/* 다른 곳에 있는 border에 이어지는 border만 클릭할 수 있음(가장 첫번째 selected 예외) */
			!!(
				findExistSideSelected(borderId, sideId, 'left', 'current').length ===
					0 &&
				findExistSideSelected(borderId, sideId, 'right', 'current').length ===
					0 &&
				(selected.horizontal.find((border) => border.owner === currentPlayer) ??
					selected.vertical.find((border) => border.owner === currentPlayer))
			) ||
			/* 다른 border 2개로 막혀있는 곳 사이를 뚫고 지나갈 수 없음 */
			!!(
				(findExistSideSelected(borderId, sideId, 'left', 'other').filter(
					(border) => border.direction === otherDirection
				).length === 2 &&
					findExistSideSelected(borderId, sideId, 'right', 'current').length ===
						0) ||
				(findExistSideSelected(borderId, sideId, 'right', 'other').filter(
					(border) => border.direction === otherDirection
				).length === 2 &&
					findExistSideSelected(borderId, sideId, 'left', 'current').length ===
						0) ||
				(findExistSideSelected(borderId, sideId, 'left', 'other').filter(
					(border) => border.direction === otherDirection
				).length === 2 &&
					findExistSideSelected(borderId, sideId, 'right', 'other').filter(
						(border) => border.direction === otherDirection
					).length === 2)
			);

		const newSelecteds: selected = {
			horizontal: [],
			vertical: [],
		};

		console.log(findSideSelected(2, 2, 'left', 'horizontal'));

		/* 하나의 selected 주변에 아무에게도 선택되지 않은 selected를 찾는 함수 */
		/* 재귀실행은 포기하고 단일 selected에 적용되는 함수로 변환해야함. */
		/* 12/21 selected와 이웃한 selected 중 소유권 없는 selected 찾기 완료 */
		const findUnownedSelecteds = (selecteds: selected) => {
			const tempSelecteds: selected = { horizontal: [], vertical: [] };
			for (const selectedKey in selecteds) {
				if (selectedKey !== 'horizontal' && selectedKey !== 'vertical') return;
				const otherSelectedKey =
					selectedKey === 'horizontal' ? 'vertical' : 'horizontal';
				for (const item of selecteds[selectedKey]) {
					if (item.owner === currentPlayer) {
						const { border, side } = item;
						const processIterate = (horizontalDirection: 'left' | 'right') => {
							const commonExistSelected = (kind: 'all' | 'other' | 'current') =>
								findExistSideSelected(
									border,
									side,
									horizontalDirection,
									kind,
									selectedKey
								);
							const verticalCondition = (
								verticalDirection: 'top' | 'bottom'
							) => {
								const objectSelected = findSideSelected(
									border,
									side,
									horizontalDirection,
									selectedKey
								)[verticalDirection];
								if (
									!commonExistSelected('all').find(
										(item) =>
											item.direction === otherSelectedKey &&
											item.border === objectSelected.border &&
											item.side === objectSelected.side
									) &&
									!tempSelecteds[otherSelectedKey].find(
										(item) =>
											item.border === objectSelected.border &&
											item.side === objectSelected.side
									) &&
									objectSelected.border >= 0 &&
									objectSelected.side >= 0
								) {
									tempSelecteds[otherSelectedKey].push(objectSelected);
								}
							};
							if (
								commonExistSelected('other').filter(
									(border) => border.direction === otherSelectedKey
								).length !== 2
							) {
								const commonFindSideSelected = findSideSelected(
									border,
									side,
									horizontalDirection,
									selectedKey
								).middle;
								if (
									!commonExistSelected('all').find(
										(border) => border.direction === selectedKey
									) &&
									!tempSelecteds[selectedKey].find(
										(item) =>
											item.border === commonFindSideSelected.border &&
											item.side === commonFindSideSelected.side
									) &&
									commonFindSideSelected.border >= 0 &&
									commonFindSideSelected.side >= 0
								) {
									tempSelecteds[selectedKey].push(commonFindSideSelected);
								}
								verticalCondition('top');
								verticalCondition('bottom');
							}
						};
						processIterate('left');
						processIterate('right');
					}
				}
			}
			console.log(tempSelecteds);

			/* tempSelecteds.horizontal = [
				...formattedSelected.horizontal,
				...tempSelecteds.horizontal,
			];
			tempSelecteds.vertical = [
				...formattedSelected.vertical,
				...tempSelecteds.vertical,
			]; */

			/* if (
				tempSelecteds.horizontal.length > 0 &&
				tempSelecteds.vertical.length > 0
			) {
				findUnownedSelecteds(tempSelecteds);
			} */
		};

		findUnownedSelecteds(formattedSelected);

		// const countSelectableBorder = () => {formattedSelected.horizontal.filter(border => border.)};

		if (breakOnClickCondition) return;
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
					existSelected.owner = currentPlayer;
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

		/** const deepNewBoxes: boxes = JSON.parse(JSON.stringify(boxes));
		 *
		 *  이러한 방식의 깊은 복사는 undefined를 제거해버림
		 * */
		const deepNewBoxes: boxes = boxes.map((item) => ({ ...item }));

		if (
			findExistSideSelected(borderId, sideId, 'left', 'current').length > 0 &&
			findExistSideSelected(borderId, sideId, 'right', 'current').length > 0
		) {
			const enclosedBoxes = findClosedBoxByDirection('horizontal').map((item) =>
				getEnclosedBox(item, otherDirection)
			);
			for (const box of enclosedBoxes) {
				const surroundedBoxCount = box.horizontal.reduce(
					(count, id) => (boxes[id].isSurrounded ? count + 1 : count),
					0
				);
				const isBoxesIncludeOtherPlayers = box.horizontal.find(
					(boxEl) => boxes[boxEl].owner === otherPlayer
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
					/* 여기서 upBox !== false를 해줘야 upBox가 0일때 true를 반환해야 하지만 0자체가 falsy이기 때문에 false로 판단되는 버그를 방지할 수 있다. 
					   논리합 사용 상황에서는 논리합('||') 대신 병합연산자('??')를 사용하면 falsy인 상황이 아닌 null이나 undefined상황만 잡아줄 수도 있다. */
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
		setCurrentPlayer(otherPlayer);

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
	const { boxes, currentPlayer } = useHomeContext();
	return (
		<>
			<TitleContainer>
				<Player $currentPlayer={currentPlayer}>{currentPlayer}</Player>
				<span>{`'s`}&nbsp;</span>
				<Turn>{`turn`}</Turn>
			</TitleContainer>
			<BoardLayout>
				<PlayerCard player="player1" />
				<BoardItemsWrapper>
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
				</BoardItemsWrapper>
				<PlayerCard player="player2" />
			</BoardLayout>
		</>
	);
};

const Home = () => {
	return (
		<HomeProvider>
			<Layout>
				<Board />
			</Layout>
		</HomeProvider>
	);
};

export default Home;
