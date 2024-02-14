/** 두 배열이 공통요소를 가지고 있는지 판단하는 함수 */
export function haveCommonElements(firstArray: number[], secondArray: number[]) {
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
		if (sortByOrder(arr1, 'ascending')[i] !== sortByOrder(arr2, 'ascending')[i]) {
			return false;
		}
	}
	return true;
}

/** 숫자를 요소로 갖는 두 배열의 공통요소를 리턴하는 함수 */
export function getNumArrayCommonElements(arr1: number[], arr2: number[]) {
	return arr1.filter((el) => arr2.includes(el));
}

/** 중첩된 배열에서 비교배열과 공통요소를 가지고 있는 2차 배열을 모두 리턴하는 함수 */
export function findCommonElementInNestedArray(compareArray: number[], nestedArray: number[][]) {
	const newNestedArray = [...nestedArray];
	const resultArray = newNestedArray.reduce<number[][]>(
		(prevArray, currentElement) =>
			haveCommonElements(currentElement, compareArray) ? [...prevArray, currentElement] : prevArray,
		[]
	);

	return resultArray;
}

/** 파라미터1 : 정렬할 배열, 파라미터2 : 오름차순/내림차순 방법 */
export function sortByOrder(array: number[], method: 'ascending' | 'descending') {
	const newArray = array.slice();
	if (method === 'ascending') {
		return newArray.sort((a, b) => a - b);
	} else {
		return newArray.sort((a, b) => b - a);
	}
}

/** direction을 고려하지 않고 두 selected의 위치가 같은지 border, side, direction에 의해 비교해서 참, 거짓을 반환하는 함수 */
export function compareSelecteds(
	arr1: BorderState | BorderStateWithDirection,
	arr2: BorderState | BorderStateWithDirection,
	opt: { withDirection: boolean }
) {
	if (
		Object.keys(arr1).includes('direction') &&
		Object.keys(arr2).includes('direction') &&
		opt.withDirection
	) {
		const newArr1 = arr1 as BorderStateWithDirection;
		const newArr2 = arr2 as BorderStateWithDirection;
		return (
			newArr1.border === newArr2.border &&
			newArr1.side === newArr2.side &&
			newArr1.direction === newArr2.direction
		);
	} else {
		return arr1.border === arr2.border && arr1.side === arr2.side;
	}
}

/** 객체의 border, side, direction 값을 비교해서 comparison과 중첩되지 않는 source값만 반환하는 함수 */
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
export function getOppositeElement(element: Direction | HorizontalPos | PlayerElement) {
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

/** 단어의 첫글자를 대문자로 바꿔주는 함수 */
export function capitalizeFirstLetter(letter: string) {
	return letter.charAt(0).toUpperCase() + letter.slice(1);
}

/** deepCopy */
export function deepCopy<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(deepCopy) as T;
	}

	const result: Record<string, unknown> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = Object.keys(obj).length ? deepCopy((obj as Record<string, unknown>)[key]) : {};
		}
	}

	return result as T;
}

/** Fisher-Yates suffle 함수, 1차원까지 깊은 복사 */
export function shuffleArray<T>(array: T[]): T[] {
	const shuffledArray = deepCopy<T[]>(array);
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const randomIndex = Math.floor(Math.random() * (i + 1));
		// 노올라운 배열 구조분해 할당
		[shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
	}
	return shuffledArray;
}

/** 함수 성능 측정 장난감 */
export function measurePerformance(func: () => void): number {
	const start = performance.now();
	func();
	const end = performance.now();
	return end - start;
}

/** 변수를 받아 padding속성 리터럴을 만들어주는 함수  */
export function getPaddingFromOption(padding: {
	top: number;
	right: number;
	bottom: number;
	left: number;
}) {
	const { top, right, bottom, left } = padding;
	return `${top}px ${right}px ${bottom}px ${left}px`;
}

/** index가 columns와 rows에서 어느 위치에 있는지 반환하는 함수 */
export function getColumnAndRow(number: number, columns: number, rows: number) {
	return { column: number % columns, row: Math.floor(number / rows) };
}

/** square와 같은 column이나 row에 있는 다른 square를 반환하는 함수 */
export function getColumnAndRowSquares({
	index,
	squareStates,
}: {
	index: number;
	squareStates: SquareStates[];
}) {
	const { column, row } = getColumnAndRow(index, 8, 8);
	return squareStates.reduce<{
		column: { lower: SquareStates[]; upper: SquareStates[] };
		row: { lower: SquareStates[]; upper: SquareStates[] };
	}>(
		(accumulator, currentSquare) => {
			const squarePosition = getColumnAndRow(currentSquare.index, 8, 8);
			const currentIndex = currentSquare.index;
			switch (true) {
				case currentIndex === index:
					return accumulator;
				case squarePosition.column === column || squarePosition.row === row: {
					const range: 'lower' | 'upper' = currentSquare.index < index ? 'lower' : 'upper';
					const targetDirection: 'column' | 'row' =
						squarePosition.column === column ? 'column' : 'row';
					return {
						...accumulator,
						[targetDirection]: {
							...accumulator[targetDirection],
							[range]:
								range === 'lower'
									? [currentSquare, ...accumulator[targetDirection][range]]
									: [...accumulator[targetDirection][range], currentSquare],
						},
					};
				}
				default:
					return accumulator;
			}
		},
		{ column: { lower: [], upper: [] }, row: { lower: [], upper: [] } }
	);
}

/** 특정 index의 square가 flip됐을 때 가질 수 있는 flippedSquares를 반환하는 함수 */
export function getFlippeds(index: number, squares: SquareStates[], targetPlayer: PlayerElement) {
	const getFlippedBySide = (squares: SquareStates[], targetPlayer: PlayerElement) => {
		let resultSquares: SquareStates[] = [];
		for (const square of squares) {
			const { owner } = square;
			switch (owner) {
				case targetPlayer:
					return resultSquares;
				case 'unowned':
					return [];
				case getOppositeElement(targetPlayer):
					resultSquares = [...resultSquares, square];
					break;
				default:
					break;
			}
		}
		return [];
	};
	const targetSquares = getColumnAndRowSquares({ index, squareStates: squares });
	let resultSquares: SquareStates[] = [];
	for (const direction in targetSquares) {
		for (const boundary in targetSquares[direction as SquaresDirection]) {
			const assertedBoundary = targetSquares[direction as SquaresDirection][boundary as Boundary];
			resultSquares = [...resultSquares, ...getFlippedBySide(assertedBoundary, targetPlayer)];
		}
	}
	return resultSquares;
}

/** squares중에서 targetPlayer의 flippable한 squares를 반환하는 함수  */
export function getFlippables(squares: SquareStates[], targetPlayer: PlayerElement) {
	const opponentSquares = squares.filter(
		(square) => square.owner === getOppositeElement(targetPlayer)
	);
	const enclosingSquares = squares.filter((square) => {
		const { index, owner } = square;
		return (
			owner === 'unowned' &&
			[index - 1, index + 1, index - 8, index + 8].some((index) =>
				opponentSquares.some((square) => square.index === index)
			)
		);
	});
	return enclosingSquares.filter(
		(square) => getFlippeds(square.index, squares, targetPlayer).length
	);
}
