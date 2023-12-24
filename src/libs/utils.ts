/** 두 배열이 공통요소를 가지고 있는지 판단하는 함수 */
export function haveCommonElements(
	firstArray: number[],
	secondArray: number[]
) {
	for (const firstElement of firstArray) {
		for (const secondElement of secondArray) {
			if (firstElement === secondElement) {
				return true;
			}
		}
	}
	return false;
}

/** 숫자를 요소로 갖는 두 배열이 순서에 상관 없이 완전히 일치하는지 판단하는 함수 */
export function isNumArrayEqual(arr1: number[], arr2: number[]) {
	if (arr1.length !== arr2.length) return false;
	for (let i = 0; i < arr1.length; i++) {
		if (
			sortByOrder(arr1, 'ascending')[i] !== sortByOrder(arr2, 'ascending')[i]
		) {
			return false;
		}
	}
	return true;
}

/** 중첩된 배열에서 비교배열과 공통요소를 가지고 있는 2차 배열을 모두 리턴하는 함수 */
export function findCommonElementInNestedArray(
	compareArray: number[],
	nestedArray: number[][]
) {
	const newNestedArray = [...nestedArray];
	const resultArray = newNestedArray.reduce<number[][]>(
		(prevArray, currentElement) =>
			haveCommonElements(currentElement, compareArray)
				? [...prevArray, currentElement]
				: prevArray,
		[]
	);

	return resultArray;
}

/** 파라미터1 : 정렬할 배열, 파라미터2 : 오름차순/내림차순 방법 */
export function sortByOrder(
	array: number[],
	method: 'ascending' | 'descending'
) {
	const newArray = array.slice();
	if (method === 'ascending') {
		return newArray.sort((a, b) => a - b);
	} else {
		return newArray.sort((a, b) => b - a);
	}
}

/** 객체의 border, side, direction 값을 비교해서 comparison에 존재하지 않는 source값만 반환하는 함수 */
export function compareAndFilterSelecteds(
	sourceSelecteds: Array<BorderState & { direction: Direction }>,
	comparisonSelecteds: Array<BorderState & { direction: Direction }>
) {
	const result = sourceSelecteds.filter(
		(selected) =>
			!comparisonSelecteds.some(
				(item) =>
					item.border === selected.border &&
					item.side === selected.side &&
					item.direction === selected.direction
			)
	);
	return result;
}

/** direction, currentPlayer, HorizontalPos 타입의 요소를 넣어서 반대값을 반환받는 함수 */
export function getOppositeElement(element: PlayerElement): PlayerElement;
export function getOppositeElement(element: HorizontalPos): HorizontalPos;
export function getOppositeElement(element: Direction): Direction;
export function getOppositeElement(
	element: Direction | HorizontalPos | PlayerElement
) {
	switch (element) {
		case 'horizontal':
		case 'vertical':
			return element === 'horizontal' ? 'vertical' : 'horizontal';
		case 'left':
		case 'right':
			return element === 'left' ? 'right' : 'left';
		case 'player1':
		case 'player2':
			return element === 'player1' ? 'player2' : 'player1';
		default:
			throw new Error('Unexpected element type');
	}
}
