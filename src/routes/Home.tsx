import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
	compareAndFilterSelecteds,
	getOppositeElement,
	findCommonElementInNestedArray,
	sortByOrder,
	isNumArrayEqual,
	compareSelecteds,
} from '../libs/utils';
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
	common: {
		noneActiveBorder: '#808080',
		activeBorder: '#f07400',
		ownableBorder: '#bda93c',
	},
};

const colorChange = (player: 'player1' | 'player2' | 'common') => keyframes`
	0%{border-color: ${colors[player].noneActiveBorder}}
	50%{border-color: ${colors.common.ownableBorder}}
	100%{border-color: ${colors[player].noneActiveBorder}}
`;

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

const BoxStyle = styled.div<DirectionInterface>`
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
		} else if (props.$isOwnable) {
			return colors.common.ownableBorder;
		} else {
			return colors[props.$currentPlayer].noneActiveBorder;
		}
	}};
	${(props) =>
		props.$isOwnable &&
		!props.$isSelected &&
		css`
			animation: ${colorChange(props.$currentPlayer)} 3s infinite;
		`}
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
}: BoxCollectionProps) => {
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
	const opponentPlayer = getOppositeElement(currentPlayer);
	const oppositeDirection = getOppositeElement(direction);
	const onBoxClick = (sideId: number) => {
		const formattedSelected: Selected = !selected[direction].some(
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
							ownable: { player1: false, player2: false },
						} /* satisfies === 중복 검사 */ satisfies BorderState,
					],
			  }
			: selected;

		const matchSelectedsLocation = (
			comparatorSelected: BorderState,
			targetSelected: BorderState
		) =>
			comparatorSelected.border === targetSelected.border &&
			comparatorSelected.side === targetSelected.side;

		const findSides = (
			selectedBorderId: number,
			selectedSideId: number,
			sidePos: HorizontalPos,
			selectedDireciton: Direction,
			currentPlayer: PlayerElement
		) => {
			const createBorderOrSide = ({
				borderId,
				sideId,
				sidePos,
				direction,
				heightPos,
			}: CreateBorderOrSideProps): BorderState => {
				const mainBorder =
					sideId +
					(direction === 'horizontal'
						? sidePos === 'left'
							? heightPos === 'middle'
								? -1
								: 0
							: 1
						: sidePos === 'left'
						? 1
						: heightPos === 'middle'
						? -1
						: 0);
				const subBorder = heightPos === 'top' ? borderId - 1 : borderId;
				return {
					border: heightPos === 'middle' ? subBorder : mainBorder,
					side: heightPos === 'middle' ? mainBorder : subBorder,
					isSelected: false,
					owner: currentPlayer,
					isMergeable: false,
					ownable: { player1: false, player2: false },
				};
			};
			const commonParams = {
				borderId: selectedBorderId,
				sideId: selectedSideId,
				sidePos,
				direction: selectedDireciton,
			};
			return {
				top: createBorderOrSide({ ...commonParams, heightPos: 'top' }),
				middle: createBorderOrSide({ ...commonParams, heightPos: 'middle' }),
				bottom: createBorderOrSide({ ...commonParams, heightPos: 'bottom' }),
			};
		};

		const findExistSides = ({
			borderId,
			sideId,
			selectedDirection,
			sidePos,
			sourcePlayer,
			owner,
			sourceSelecteds,
		}: FindExistSidesProps): BorderStateWithDirection[] => {
			const localOppositDirection = getOppositeElement(selectedDirection);
			const localOppositPlayer = getOppositeElement(sourcePlayer);
			return [
				...sourceSelecteds[localOppositDirection]
					.filter(
						(item) =>
							(owner === 'current'
								? item.owner === sourcePlayer
								: owner === 'other'
								? item.owner === localOppositPlayer
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
						direction: localOppositDirection,
					})),
				...sourceSelecteds[selectedDirection]
					.filter(
						(item) =>
							(owner === 'current'
								? item.owner === sourcePlayer
								: owner === 'other'
								? item.owner === localOppositPlayer
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
			] as Array<BorderState & { direction: Direction }>;
		};

		const findNotExistSelected = (
			border: number,
			side: number,
			direction: Direction,
			horizontalPos: HorizontalPos,
			sourceSelecteds: Selected,
			currenPlayer: PlayerElement
		) => {
			const existSideSelecteds = findExistSides({
				borderId: border,
				sideId: side,
				sidePos: horizontalPos,
				owner: 'all',
				selectedDirection: direction,
				sourceSelecteds,
				sourcePlayer: currenPlayer,
			});
			const sideSelecteds = findSides(
				border,
				side,
				horizontalPos,
				direction,
				currenPlayer
			);
			const mappedSelecteds = Object.entries(sideSelecteds)
				.filter(
					(selected) =>
						selected[1].border >= 0 &&
						selected[1].border < 6 &&
						selected[1].side >= 0 &&
						selected[1].side < 5
				)
				.map((selected) => ({
					...selected[1],
					direction:
						selected[0] === 'middle'
							? direction
							: getOppositeElement(direction),
				}));
			const result = compareAndFilterSelecteds(
				mappedSelecteds,
				existSideSelecteds
			);
			return result;
		};

		const isSelectedBlocked = ({
			border,
			side,
			direction,
			objectPos,
		}: IsBlockedProps) => {
			const localOppositeDirection = getOppositeElement(direction);
			return (
				findExistSides({
					borderId: border,
					sideId: side,
					sidePos: objectPos,
					owner: 'other',
					selectedDirection: direction,
					sourceSelecteds: formattedSelected,
					sourcePlayer: currentPlayer,
				}).filter((border) => border.direction === localOppositeDirection)
					.length === 2
			);
		};

		const canClickWhenBlocked = ({
			border,
			side,
			direction,
			objectPos,
			sourceSelecteds,
			currentPlayer,
		}: CanClickWhenBlockedProps) =>
			isSelectedBlocked({
				border,
				side,
				direction,
				objectPos,
			}) &&
			findExistSides({
				borderId: border,
				sideId: side,
				sidePos: getOppositeElement(objectPos),
				owner: 'current',
				selectedDirection: direction,
				sourceSelecteds,
				sourcePlayer: currentPlayer,
			}).length === 0;

		const shouldAbort = ({
			selected,
			borderId,
			sideId,
			direction,
			sourceSelecteds,
			currentPlayer,
		}: ShouldAbortProps) => {
			/* Omit === 타입빼기 */
			const commonFindExistSidesProps: Omit<FindExistSidesProps, 'sidePos'> = {
				borderId,
				sideId,
				owner: 'current',
				selectedDirection: direction,
				sourceSelecteds,
				sourcePlayer: currentPlayer,
			};
			const notHasExistSide = (
				sidePos: HorizontalPos,
				commonProps: typeof commonFindExistSidesProps
			): boolean => findExistSides({ ...commonProps, sidePos }).length === 0;
			const commonCanClickWhenBlockedProps: Omit<
				CanClickWhenBlockedProps,
				'objectPos'
			> = {
				border: borderId,
				side: sideId,
				direction,
				sourceSelecteds,
				currentPlayer,
			};
			const canClickWhenBlockedBySide = (
				objectPos: HorizontalPos,
				commonProps: typeof commonCanClickWhenBlockedProps
			) =>
				canClickWhenBlocked({
					...commonProps,
					objectPos,
				});
			const commonIsSelectedBlockedProps: Omit<IsBlockedProps, 'objectPos'> = {
				border: borderId,
				side: sideId,
				direction,
			};
			const isSelectedBlockedBySide = (
				objectPos: HorizontalPos,
				commonProps: typeof commonIsSelectedBlockedProps
			) =>
				isSelectedBlocked({
					...commonProps,
					objectPos,
				});
			return (
				/* 같은 자리에 이미 클릭된 border가 있을 경우  */
				!!selected[direction].some(
					(item) => item.border === borderId && item.side === sideId
				) ||
				/* 다른 곳에 있는 border에 이어지는 border만 클릭할 수 있음(가장 첫번째 selected 예외) */
				!!(
					notHasExistSide('left', commonFindExistSidesProps) &&
					notHasExistSide('right', commonFindExistSidesProps) &&
					(selected.horizontal.some(
						(border) => border.owner === currentPlayer
					) ||
						selected.vertical.some((border) => border.owner === currentPlayer))
				) ||
				/* 다른 border 2개로 막혀있는 곳 사이를 뚫고 지나갈 수 없음 */
				canClickWhenBlockedBySide('left', commonCanClickWhenBlockedProps) ||
				canClickWhenBlockedBySide('right', commonCanClickWhenBlockedProps) ||
				(isSelectedBlockedBySide('left', commonIsSelectedBlockedProps) &&
					isSelectedBlockedBySide('right', commonIsSelectedBlockedProps))
			);
		};

		if (
			shouldAbort({
				borderId,
				sideId,
				selected,
				direction,
				currentPlayer,
				sourceSelecteds: formattedSelected,
			})
		)
			return;

		const currentPlayerSelecteds = (
			player: PlayerElement,
			sourceSelecteds: Selected
		) => ({
			horizontal: sourceSelecteds.horizontal.filter(
				(item) => item.owner === player
			),
			vertical: sourceSelecteds.vertical.filter(
				(item) => item.owner === player
			),
		});

		const insertDirectionAtSelecteds = (selecteds: Selected) => {
			const results = [
				...selecteds.horizontal.map((selected) => ({
					...selected,
					direction: 'horizontal',
				})),
				...selecteds.vertical.map((selected) => ({
					...selected,
					direction: 'vertical',
				})),
			] as BorderStateWithDirection[];
			return results;
		};

		/** 재귀함수에서 함수의 재호출 부분을 return하지 않으면 콜스택에서 실행컨텍스트가 하나씩 제거될 때
		 *
		 *  return (상위 실행컨텍스트의 실행값);이 되어서 반환값을 다시 다음 실행컨텍스트에 물려줘야 하는데
		 *
		 * 	return을 넣지 않으면 해당 실행컨텍스트에서 (상위 실행컨텍스트의 실행값); 을 실행하게 되고,
		 *
		 * 	이건 곧 return이 없는 것이니 undefined를 뱉어내게 된다.
		 *
		 *  그러면 다음 실행컨텍스트는 상위 실행컨텍스트의 실행값으로 undefined를 받으면서 return이 없어 undefined를 뱉어내게 되어
		 *
		 * 	실행 컨텍스트가 모두 해결될 때 최종적으로 undefined를 뱉어내게 된다.
		 *  */
		/* 12/23 findUnownedRecursive재귀함수 리팩토링 순수함수이며 1가지의 목적을 가지도록 변경 */
		const findUnownedRecursive = ({
			sourceSelecteds,
			originalSelecteds,
			currentPlayer,
			recursive,
		}: FindUnownedRecursive): BorderStateWithDirection[] => {
			const findUnownedSelecteds = sourceSelecteds.reduce<
				BorderStateWithDirection[]
			>((accumulator, currentSelected) => {
				const { border, side, direction } = currentSelected;
				const getUnblockedSelecteds = ({
					border,
					side,
					direction,
					objectPos,
					player,
				}: GetUnblockedSelectedsProp) =>
					!isSelectedBlocked({
						border,
						side,
						direction,
						objectPos,
					})
						? findNotExistSelected(
								border,
								side,
								direction,
								objectPos,
								originalSelecteds,
								currentPlayer
						  ).map((item) => ({
								...item,
								ownable: { ...item.ownable, [player]: true },
						  }))
						: [];
				const commonGetUnblockedProps: Omit<
					GetUnblockedSelectedsProp,
					'objectPos'
				> = { border, side, direction, player: currentPlayer };
				const left = getUnblockedSelecteds({
					...commonGetUnblockedProps,
					objectPos: 'left',
				});
				const right = getUnblockedSelecteds({
					...commonGetUnblockedProps,
					objectPos: 'right',
				});
				const newSelecteds = [...left, ...right];
				const result = [
					...accumulator,
					...compareAndFilterSelecteds(newSelecteds, accumulator),
				];
				return result;
			}, sourceSelecteds);
			if (findUnownedSelecteds.length !== sourceSelecteds.length && recursive) {
				return findUnownedRecursive({
					sourceSelecteds: [...findUnownedSelecteds],
					originalSelecteds,
					currentPlayer,
					recursive,
				});
			} else {
				return findUnownedSelecteds;
			}
		};

		const formatUnownedSelecteds = ({
			direction,
			unownedSelecteds,
			currentPlayer,
		}: FormatUnownedSelecteds): BorderState[] =>
			unownedSelecteds
				.filter((item) => item.direction === direction)
				.map(
					(item) =>
						({
							border: item.border,
							side: item.side,
							owner: item.owner,
							isSelected: item.isSelected,
							isMergeable: item.isMergeable,
							ownable: { ...item.ownable, [currentPlayer]: true },
						}) satisfies BorderState
				)
				.sort((a, b) => {
					if (a.border !== b.border) {
						return a.border - b.border;
					} else {
						return a.side - b.side;
					}
				});

		const createUnownedSelecteds = (
			isRecursive: boolean,
			originalSelecteds: Selected
		) => {
			const createUnownedArray = (
				player: PlayerElement,
				localIsRecursive: boolean,
				localOriginalSelecteds: Selected
			) => {
				const commonProps = {
					sourceSelecteds: insertDirectionAtSelecteds(
						currentPlayerSelecteds(player, localOriginalSelecteds)
					),
					originalSelecteds: localOriginalSelecteds,
					currentPlayer: player,
					recursive: localIsRecursive,
				};
				return compareAndFilterSelecteds(
					findUnownedRecursive(commonProps),
					insertDirectionAtSelecteds(
						currentPlayerSelecteds(player, localOriginalSelecteds)
					)
				);
			};
			return {
				player1: createUnownedArray('player1', isRecursive, originalSelecteds),
				player2: createUnownedArray('player2', isRecursive, originalSelecteds),
			};
		};

		const createFormattedUnownedSelecteds = (
			originalSelecteds: Selected
		): OwnableSelecteds => {
			const createFormattedObject = (player: PlayerElement) => {
				const createCommonProps = (
					commonDirection: Direction,
					commonPlayer: PlayerElement
				): FormatUnownedSelecteds => {
					const unownedSelecteds = createUnownedSelecteds(
						false,
						originalSelecteds
					);
					return {
						direction: commonDirection,
						unownedSelecteds: unownedSelecteds[commonPlayer],
						currentPlayer: commonPlayer,
					};
				};
				return {
					horizontal: formatUnownedSelecteds(
						createCommonProps('horizontal', player)
					),
					vertical: formatUnownedSelecteds(
						createCommonProps('vertical', player)
					),
				};
			};
			return {
				player1: createFormattedObject('player1'),
				player2: createFormattedObject('player2'),
			};
		};

		const recursiveUnownedSelecteds = createUnownedSelecteds(
			true,
			formattedSelected
		);

		const formattedUnownedSelecteds =
			createFormattedUnownedSelecteds(formattedSelected);

		console.log(createUnownedSelecteds(false, formattedSelected));

		console.log(createFormattedUnownedSelecteds(formattedSelected));

		const borderToBox = (
			direction: Direction,
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

		const boxToborder = ({
			boxIndex,
			direction,
			isSelected,
			isMergeable,
			owner,
			sourceSelecteds,
		}: BoxToBorderProps) => {
			const resultSelected: (opt: number) => BorderState = (opt) => {
				const remainder = boxIndex % 5;
				const quotient = Math.floor(boxIndex / 5);
				const isHorizontal = direction === 'left' || direction === 'right';
				const border = (isHorizontal ? remainder : quotient) + opt;
				const side = isHorizontal ? quotient : remainder;
				const existSelected = sourceSelecteds[
					isHorizontal ? 'vertical' : 'horizontal'
				].find((item) => item.border === border && item.side === side);
				if (existSelected) {
					return { ...existSelected, owner };
				} else {
					return {
						border,
						side,
						isSelected,
						owner,
						isMergeable,
						ownable: { player1: false, player2: false },
					} satisfies BorderState;
				}
			};
			switch (true) {
				case direction === 'left' || direction === 'up':
					return resultSelected(0);
				case direction === 'right' || direction === 'down':
					return resultSelected(1);
			}
		};

		// 순수함수로 수정, 로직 재고 필요, 빈배열은 리턴하지 않는 로직은 유지
		const findClosedBoxByDirection = (direction: Direction) => {
			const isHorizontal = direction === 'horizontal';
			return Array.from({ length: 5 }, (_, id) => {
				const borders = formattedSelected[direction]
					.filter((item) => item.side === id && item.owner === currentPlayer)
					.sort((a, b) => a.border - b.border);
				return borders.length > 1
					? Array.from({ length: borders.length - 1 }, (_, idx) =>
							Array.from(
								{ length: borders[idx + 1].border - borders[idx].border },
								(_, index) => {
									const boxNumber =
										(borders[idx].border + index) * (isHorizontal ? 5 : 1) +
										borders[idx].side * (isHorizontal ? 1 : 5);
									return boxes[boxNumber].isSurrounded &&
										boxes[boxNumber].owner === currentPlayer
										? undefined
										: boxNumber;
								}
							)
					  )
					: [];
			})
				.flat()
				.reduce<number[][]>((accumulator, currentBoxes) => {
					const removedSurrounded = currentBoxes.filter(
						(box) => box !== undefined
					) as number[];
					return removedSurrounded.length > 0
						? [...accumulator, removedSurrounded]
						: accumulator;
				}, []);
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
		const createGetEnclosedClosure = (
			initBoxes: number[],
			closedBoxesArray: Record<Direction, number[][]>,
			currentDirection: Direction = 'horizontal'
		) => {
			const accumulator: Record<Direction, number[][]> = {
				horizontal: [],
				vertical: [],
			};
			let sourceBoxes = [initBoxes];
			let bordersDirection = currentDirection;
			const getEnclosedBoxesRecursive = (): number[] | false => {
				const localOppositeDirection = getOppositeElement(bordersDirection);
				sourceBoxes = sourceBoxes
					.reduce<number[][]>((accumulatedBoxes, currentbox) => {
						const newBoxes = findCommonElementInNestedArray(
							currentbox,
							closedBoxesArray[localOppositeDirection]
						).filter(
							(box) => !accumulatedBoxes.some((el) => isNumArrayEqual(el, box))
						);
						return [...accumulatedBoxes, ...newBoxes];
					}, [])
					.filter(
						(box) =>
							!accumulator[localOppositeDirection].some((el) =>
								isNumArrayEqual(el, box)
							)
					);
				if (sourceBoxes.length > 0) {
					accumulator[localOppositeDirection] = [
						...accumulator[localOppositeDirection],
						...sourceBoxes,
					];
					bordersDirection = localOppositeDirection;
					return getEnclosedBoxesRecursive();
				} else if (
					accumulator.horizontal.length > 0 &&
					isNumArrayEqual(
						accumulator.horizontal.flat(),
						accumulator.vertical.flat()
					)
				) {
					return accumulator.horizontal.flat();
				} else {
					return false;
				}
			};
			return getEnclosedBoxesRecursive;
		};

		/** const deepNewBoxes: boxes = JSON.parse(JSON.stringify(boxes));
		 *
		 *  JSON 방식의 깊은 복사는 undefined를 제거해버림
		 * */
		const commonEnclosedProps: Omit<FindExistSidesProps, 'sidePos'> = {
			borderId,
			sideId,
			owner: 'current',
			selectedDirection: direction,
			sourceSelecteds: formattedSelected,
			sourcePlayer: currentPlayer,
		};

		const hasSidesBySide = (
			sidePos: HorizontalPos,
			commonProps: typeof commonEnclosedProps
		) =>
			findExistSides({
				...commonProps,
				sidePos,
			}).length > 0;

		const createNewPlayerInfo = ({
			player,
			playerInfos,
			boxesResult,
			ownableSelecteds,
			opt,
		}: CreateNewPlayerInfoProps) => {
			return {
				...playerInfos[player],
				boxCount: opt.withBoxCount
					? boxesResult.filter(
							(item) => item.owner === player && item.isSurrounded
					  ).length
					: playerInfos[player].boxCount,
				ownableSelecteds: ownableSelecteds[player],
			};
		};

		const createCommonPlayerInfoProps = (
			player: PlayerElement,
			rest: Omit<CreateNewPlayerInfoProps, 'player'>
		): CreateNewPlayerInfoProps => ({
			player,
			...rest,
		});

		/* 중첩배열 제거, 같은 배열이 여러번 쌓이는 현상 방지 */
		const getEnclosedBoxes = (closedBoxes: number[][]) => {
			for (const box of closedBoxes) {
				const enclosedBox = createGetEnclosedClosure(
					box,
					{
						horizontal: findClosedBoxByDirection('horizontal'),
						vertical: findClosedBoxByDirection('vertical'),
					},
					'horizontal'
				)();
				if (enclosedBox) {
					return enclosedBox;
				}
			}
			/* 빈 배열이 나올 경우의 수는 없음 */
			return [];
		};

		/* 임의의 구역이 enclosed가 될 시 */
		if (
			hasSidesBySide('left', commonEnclosedProps) &&
			hasSidesBySide('right', commonEnclosedProps)
		) {
			const enclosedBoxes = getEnclosedBoxes(
				findClosedBoxByDirection('horizontal')
			);

			const getMergeableFromEnclosedBoxes = (
				box: number[],
				player: PlayerElement,
				sourceSelecteds: Selected
			) => {
				const resultSelecteds = ({
					direction,
					border,
					box,
					boxIndex,
					accumulator,
				}: resultSelectedsProps) => {
					const addCount = direction === 'horizontal' ? 5 : 1;
					return border &&
						box.includes(boxIndex + addCount) &&
						!accumulator[direction].some((selected) =>
							compareSelecteds(selected, border, {
								withDirection: false,
							})
						)
						? [...accumulator[direction], { ...border, isMergeable: true }]
						: [...accumulator[direction]];
				};
				const result = box.reduce<Selected>(
					(accumulator, boxIndex) => {
						const commonBoxToBorderProps = {
							boxIndex,
							isSelected: true,
							isMergeable: true,
							owner: player,
							sourceSelecteds,
						};
						const commonResultSelectedsProps = { box, boxIndex, accumulator };
						const rightBorder = boxToborder({
							direction: 'right',
							...commonBoxToBorderProps,
						});
						const downBorder = boxToborder({
							direction: 'down',
							...commonBoxToBorderProps,
						});

						return {
							...accumulator,
							horizontal: resultSelecteds({
								direction: 'horizontal',
								border: downBorder,
								...commonResultSelectedsProps,
							}),
							vertical: resultSelecteds({
								direction: 'horizontal',
								border: rightBorder,
								...commonResultSelectedsProps,
							}),
						};
					},
					{ horizontal: [], vertical: [] }
				);
				return result;
			};

			const getMergedBoxesWithEnclosed = (
				originalBoxes: Boxes,
				currentPlayer: PlayerElement,
				enclosedBoxes: number[]
			) => {
				const opponentPlayer = getOppositeElement(currentPlayer);
				const isBoxesIncludeOpponentPlayer = enclosedBoxes.some(
					(boxIndex) => originalBoxes[boxIndex].owner === opponentPlayer
				);
				if (!isBoxesIncludeOpponentPlayer) {
					return originalBoxes.map((box, id) =>
						enclosedBoxes.includes(id)
							? { ...box, owner: currentPlayer, isSurrounded: true }
							: box
					);
				} else {
					return originalBoxes;
				}
			};

			const getAddedSelectedsBetweenEnclosedBoxes = (
				originalSelecteds: Selected,
				originalBoxes: Boxes,
				currentPlayer: PlayerElement,
				enclosedBoxes: number[]
			): Selected => {
				const opponentPlayer = getOppositeElement(currentPlayer);
				const isBoxesIncludeOpponentPlayer = enclosedBoxes.some(
					(boxIndex) => originalBoxes[boxIndex].owner === opponentPlayer
				);
				const mergeableSelecteds = getMergeableFromEnclosedBoxes(
					enclosedBoxes,
					currentPlayer,
					originalSelecteds
				);
				const commonProps = { originalSelecteds, mergeableSelecteds };
				const createResultSelecteds = ({
					direction,
					originalSelecteds,
					mergeableSelecteds,
				}: CreateResultSelectedsProps) => [
					...originalSelecteds[direction].filter(
						(selected) =>
							!mergeableSelecteds[direction].find((item) =>
								compareSelecteds(selected, item, { withDirection: false })
							)
					),
					...mergeableSelecteds[direction],
				];
				if (!isBoxesIncludeOpponentPlayer) {
					return {
						horizontal: createResultSelecteds({
							direction: 'horizontal',
							...commonProps,
						}),
						vertical: createResultSelecteds({
							direction: 'vertical',
							...commonProps,
						}),
					};
				} else {
					return originalSelecteds;
				}
			};

			/* 이미 존재하는 박스와 새로 연결되는 박스들 간의 borderMerge */
			const getMergeableSelected = (
				sourceSelecteds: Selected,
				player: PlayerElement,
				sourceBoxes: Boxes
			) => {
				const commonProps = { sourceSelecteds, player, sourceBoxes };
				const createResultProps = (
					direction: Direction,
					props: typeof commonProps
				) => {
					return { direction, ...props };
				};
				const getMergeableSelectedByDirection = ({
					direction,
					sourceSelecteds,
					player,
					sourceBoxes,
				}: IsMergeableSelected) => {
					const resultSelecteds = sourceSelecteds[direction].map((item) => {
						const upBox = borderToBox(direction, true, item.border, item.side);
						const downBox = borderToBox(
							direction,
							false,
							item.border,
							item.side
						);
						if (
							/* 0일 가능성이 있음 */
							upBox !== false &&
							downBox !== false &&
							sourceBoxes[upBox].isSurrounded &&
							sourceBoxes[downBox].isSurrounded &&
							sourceBoxes[upBox].owner === player &&
							sourceBoxes[downBox].owner === player
						) {
							return { ...item, isMergeable: true };
						}
						return item;
					});
					return resultSelecteds;
				};
				return {
					horizontal: getMergeableSelectedByDirection(
						createResultProps('horizontal', commonProps)
					),
					vertical: getMergeableSelectedByDirection(
						createResultProps('vertical', commonProps)
					),
				};
			};

			const boxesResult = getMergedBoxesWithEnclosed(
				boxes,
				currentPlayer,
				enclosedBoxes
			);

			const selectedsResult = getMergeableSelected(
				getAddedSelectedsBetweenEnclosedBoxes(
					formattedSelected,
					boxes,
					currentPlayer,
					enclosedBoxes
				),
				currentPlayer,
				boxesResult
			);

			const commonPlayerInfoProps = {
				boxesResult,
				ownableSelecteds: formattedUnownedSelecteds,
				playerInfos: players,
				opt: { withBoxCount: true },
			};

			const playersResult = {
				player1: createNewPlayerInfo(
					createCommonPlayerInfoProps('player1', commonPlayerInfoProps)
				),
				player2: createNewPlayerInfo(
					createCommonPlayerInfoProps('player2', commonPlayerInfoProps)
				),
			};

			setSelected(selectedsResult);
			setBoxes(boxesResult);
			setPlayers(playersResult);
			setCurrentPlayer(opponentPlayer);
		} else {
			const commonPlayerInfoProps = {
				boxesResult: boxes,
				ownableSelecteds: formattedUnownedSelecteds,
				playerInfos: players,
				opt: { withBoxCount: false },
			};

			const playersResult = {
				player1: createNewPlayerInfo(
					createCommonPlayerInfoProps('player1', commonPlayerInfoProps)
				),
				player2: createNewPlayerInfo(
					createCommonPlayerInfoProps('player2', commonPlayerInfoProps)
				),
			};

			setSelected(formattedSelected);
			setPlayers(playersResult);
			setCurrentPlayer(opponentPlayer);
		}
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
					const foundOwnable = players[currentPlayer].ownableSelecteds[
						direction
					].some((item) => item.border === borderId && item.side === sideId);
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
								$isOwnable={foundOwnable}
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

const BorderBox = ({ direction }: BorderBoxProps) => {
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

const PlayerCard = ({ player }: { player: PlayerElement }) => {
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
