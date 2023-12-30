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

/**
 * function ExampleComponent() {
 *  	const [count, setCount] = useState(0);
 *  	const ref = useRef(0);
 *
 *  	useEffect(() => {
 *  		console.log('useEffect 실행');
 *  		ref.current = count; // count의 현재 값으로 ref를 업데이트
 *  	}, [count]);
 *
 *  	const handleButtonClick = () => {
 *  		setCount((prevCount) => prevCount + 1); // 버튼 클릭 시 count를 1씩 증가
 *  	};
 *
 *  	console.log('컴포넌트 렌더링, count:', count, 'ref.current:', ref.current);
 *
 *  	return (
 *  		<div>
 *  			<p>Count: {count}</p>
 *  			<p>Ref.current: {ref.current}</p>
 *  			<button onClick={handleButtonClick}>Increment Count</button>
 *  		</div>
 * 		);
 * }
 *
 *
 * ------------ 위 컴포넌트의 실행과정
 *
 *
 * 첫 번째 렌더링:
 *
 * 1. '컴포넌트 렌더링, count: 0 ref.current: 0' 로그 출력
 *
 *
 * 버튼 클릭 후 두 번째 렌더링:
 *
 * 1. '컴포넌트 렌더링, count: 1 ref.current: 0' 로그 출력 (렌더링 이후의 'count'와 'ref.current')
 *
 * 2. useEffect 실행 (이때 'count'가 1이므로 'ref.current'가 'count'로 업데이트.)
 *
 * 3. 이 시점에서 count = 1, ref.current = 1
 * */
