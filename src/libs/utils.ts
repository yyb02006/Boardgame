/** 두 배열이 공통요소를 하나라도 가지고 있는지 판단하는 함수 */
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

/** 하나의 배열이 다른 중첩된 배열안의 요소와 공통 요소를 가지고 있다면 해당 요소를 리턴하는 함수 */
export function isElementInNestedArray(
	compareArray: number[],
	nestedArray: number[][]
) {
	let resultArray: number[][] = [];
	for (const ElementArray of nestedArray) {
		if (haveCommonElements(ElementArray, compareArray)) {
			resultArray = [...resultArray, ElementArray];
		}
	}
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
