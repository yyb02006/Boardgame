import { useRef, useEffect } from 'react';

export default function usePrevious<T, G>(value: T, init: T, dependency: G) {
	/**
	 * 컴포넌트의 렌더링 시 내부 함수들이 모두 실행된 뒤 useEffect가 실행됨을 헷갈리지 말자.
	 *
	 * 컴포넌트 내부 어떤 곳에서 Logging을 하더라도 useEffect로 변한 값은 찍히지 않는다.
	 *
	 * state변경으로 인한 리렌더링 시 current에는 이전 useEffect실행에서 전달받은 값이 있을 것이고
	 *
	 * count에는 이번 state가 있을 것이다. 아직 이번 state의 변경으로 인한 useEffect는 실행되지 않았기 때문에.
	 * */
	const ref = useRef<T>(init);

	useEffect(() => {
		ref.current = value;
	}, [dependency]);

	return ref.current;
}
