/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
	createContext,
	memo,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from 'react';
import styled, { css } from 'styled-components';
import { TestProvider, useTestContext } from './TestContext';

const Layout = styled.section`
	background-color: var(--bgColor-dark);
	color: #eaeaea;
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	padding: 80px 0 0 0;
`;

const Child = styled.div`
	max-width: 400px;
	width: 100%;
	height: 200px;
	background-color: blue;
	margin: 0 40px 0 0;
	padding: 12px 24px;
	font-size: 4vw;
	h3 {
		font-size: 2rem;
		font-weight: 600;
		margin: 0;
	}
`;

const ShadowOnlyElement = styled.div`
	width: 100px;
	height: 100px;
	background-color: red; /* 배경색을 투명하게 설정 */
	margin: 20px;
	filter: blur(16px); /* 그림자 스타일 지정 */
`;

const Middle = styled.div`
	height: 200px;
	width: 200px;
	background-color: green;
`;

const BoardLayout = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	height: 100%;
	background-color: yellow;
`;

/**
 * TestComp가 마운트될 때, 모든 클래스에 대한 함수가 실행된다.
 * log : One, Two, Three
 * */
const ComponentWithFunction = styled.div`
	&.One {
		${() => {
			console.log('One');
			return css`
				background-color: yellow;
			`;
		}}
	}
	&.Two {
		${() => {
			console.log('Two');
			return css`
				background-color: yellow;
			`;
		}}
	}
	&.Three {
		${() => {
			console.log('Three');
			return css`
				background-color: yellow;
			`;
		}}
	}
`;

/**
 * 애니메이션이 실행될 때 animation-direction속성을 'reverse' 변경하면,
 * 애니메이션은 바뀐 direction으로 키프레임이 실행된 상태에서 진행된다.
 * ex) 4초간 애니메이션을 실행하고 'reverse'상태가 되면 'reverse'로 4초간 실행된 시점으로 박스가 순간이동한다.
 * keyframes라는 이름을 생각하면 알 수 있는 부분.
 * 애니메이션의 재실행을 위해서는 동적으로 key값을 바꾸거나 class를 분기하면된다.
 * */
const AnimatedComp = styled.div<{ $direction: 'normal' | 'reverse' }>`
	width: 200px;
	height: 200px;
	color: blueviolet;
	background-color: yellow;
	display: flex;
	justify-content: center;
	/* class분기 방법 */
	&.normal {
		@keyframes moveNormal {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(1000px);
			}
		}
		animation: moveNormal 10s linear forwards normal;
	}
	&.reverse {
		@keyframes moveReverse {
			from {
				transform: translateX(0);
			}
			to {
				transform: translateX(1000px);
			}
		}
		animation: moveReverse 10s linear forwards reverse;
	}
	/* key값 변경 시 CSS
	@keyframes move {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(1000px);
		}
	}
	animation: move 10s linear forwards;
	animation-direction: ${(props) => props.$direction}; */
`;

/**
 * Arrow function은 클로저함수처럼 렉시컬 스코프를 가지기 때문에, 객체의 메서드로 활용될 때는 전역 스코프를 가지게 된다.
 * 그래서 메서드로 활용된 Arrow function의 this값은 불안정하다. 전역이 global이냐 window냐에 따라 다르고, strict mode가
 * 활성화되어있을 경우에는 전역객체에 대한 this는 undefined가 된다. 반면 일반함수(함수 선언형)의 경우 호출되는 방식에
 * 따라 동적으로 this를 결정하는데, function();과 같은 일반적인 호출에서는 전역객체를 this로 갖고,
 * obj.function();처럼 객체의 메서드로 활용되었을 경우에는 해당 객체를 this로 갖는다.
 */
const testObj = {
	a: function a() {
		return 2;
	},
	b: function b() {
		return 1;
	},
	c: function c() {
		return this.a() + this.b();
	},
};

/* 이 코드는 전역객체를 가리키게 된다. 콜백은 호출된 곳의 스코프와 아무런 상관이 없다. */
const obj = {
	method: function a(callback: (this: unknown) => void) {
		callback();
	},
};

function outer(this: unknown) {
	console.log(this);
}

obj.method(outer);

/**
 * 이벤트가 일어나는 범위는 자식의 범위까지 포함되고, 이는 자식 요소가 부모 요소를 벗어나 있더라도 인정된다.
 * 마우스이벤트에서 parent요소에 마우스를 이동시켜 이벤트를 작동시키고 아래에 있는 child요소에 마우스를 이동시켜도
 * parent요소의 onMouseOver가 발생하는 것을 이벤트 버블링이라고 한다. (자식컴포넌트의 이벤트가 상위컴포넌트로 전파)
 * 이벤트 전파가 발생하는 컴포넌트의 nagative event객체에서 stopPropagation메서드 호출로 전파를 막을 수 있다.
 * ++ onMouseOver와 onMouseEnter는 엄연히 다른 영역을 가리킨다.
 * */
const Card = () => {
	const onCardOver = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, clientY } = event;
		const { left, top } = event.currentTarget.getBoundingClientRect();
		console.log(left - clientX, top - clientY);
	};
	const onCardOver2 = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
	};
	return (
		<div
			onMouseOver={onCardOver}
			style={{
				width: '200px',
				height: '320px',
				color: 'red',
				backgroundColor: 'yellow',
			}}
		>
			<div
				onMouseOver={onCardOver2}
				style={{ width: '400px', height: '200px', backgroundColor: 'blue' }}
			></div>
			card
		</div>
	);
};

/**
 * transform-style:preserve-3d는 자식들의 배치관계를 3D공간에서 이루어지게 해주는 속성이다.
 * 요소에 3D변환속성을 적용해도 실제로는 2D공간에서 트랜지션을 하는 것 뿐이고, 실제 배치는 z-index와 문서구조에 따른다.
 * 예를 들어, div요소 2개를 가지고 있는 부모요소가 있을 때, 부모요소에 preserve-3d속성이 없다면,
 * translate 3D변환으로는 어떻게 해도 첫째 div를 둘째 div보다 앞으로 끌고 나올 수 없다는 것이다.
 * 단, preserve-3d를 사용할 때 주의해야할 점은 preserve-3d와 충돌하는 속성들이 있다는 것인데,
 * 예를 들어 부모요소에 filter속성을 적용하면, 해당 요소가 가지는 컨텍스트가 2D가 되며
 * 위치적인 위계가 3D에서 2D로 바뀌어 preserve-3d속성이 무시된다는 것이다.
 * */

const PerspectiveParent = styled.div`
	position: relative;
	width: 400px;
	height: 400px;
	background-color: violet;
	/* 적용하면 FirstChild가 뒤로간다. 즉, 자식의 위계 기준을 문서구조로 고정시키는 요소. */
	filter: drop-shadow(0px 0px 4px red);
	/* 요소의 위계의 기준을 문서구조에서 z축 포지션의 3D로 바꿈 이 속성이 적용되면 z-index는 작동하지 않는다. */
	transform-style: preserve-3d;
	/* filter에 상관없이 작동. 즉, 요소의 위계기준과는 상관없는 속성이라는 뜻. */
	perspective: 1000px;
	& .FirstChild,
	.SecondChild {
		width: 200px;
		height: 200px;
		position: absolute;
	}
	& .FirstChild {
		left: 0;
		top: 0;
		background-color: yellow;
		transform: translateZ(150px);
	}
	& .SecondChild {
		left: 100px;
		top: 100px;
		background-color: green;
		transform: translateZ(100px);
	}
`;

/** 거꾸로 매달린 피셔-예이츠 셔플  */
function fysReverse(array: number[]) {
	for (let i = 0; i < array.length - 1; i++) {
		const randomIndex = Math.floor(Math.random() * (array.length - i) + i);
		[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
	}
}

const Children = memo(function Children({
	setCount,
}: {
	setCount: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { contextSecond, setContextSecond } = useTestContext();
	console.log('Children Rendered');
	return (
		<div
			onClick={() => {
				setContextSecond((p) => p + 1);
			}}
		>
			Children{contextSecond}
		</div>
	);
});

function Parent({ obj, func }: { obj: { a: string; b: number; c: null }; func: () => void }) {
	const [count, setCount] = useState(0);
	console.log('Parent Rendered');
	func();
	return (
		<div>
			<div
				onClick={() => {
					setCount((p) => p + 1);
				}}
			>
				Parent{count}
			</div>
			<Children setCount={setCount}></Children>
		</div>
	);
}

const Uncle = memo(function Uncle() {
	const { contextVariable, setContextVariable } = useTestContext();
	console.log('Uncle Rendered');
	return (
		<div
			onClick={() => {
				setContextVariable((p) => p + 1);
			}}
		>
			Uncle{contextVariable}
		</div>
	);
});

/*
  이런 게 있을 거라고 타입스크립트에게 알려줄 수 있음.
  declare function interfaced(arg: string): string;
	*/

const Perspective = styled.div`
	width: 100%;
	height: 100%;
	background-color: blue;
	position: relative;
	> .childd {
		width: 500px;
		height: 500px;
		background-color: yellow;
		position: relative;
		> .childdd {
			width: 200px;
			height: 200px;
			background-color: green;
			transform: perspective(500px) translateZ(200px);
		}
	}
`;

const PerspectiveChild = styled.div`
	width: 50%;
	height: 50%;
	background-color: red;
`;

const Test = () => {
	/* 정의한 적 없지만 실행 가능, 런타임 에러
	interfaced('dd'); */
	const [direction, setDirection] = useState<'normal' | 'reverse'>('normal');
	const [count, setCount] = useState(0);
	const obj = useMemo(() => {
		return { a: 'a', b: 2, c: null };
	}, []);
	const func = () => {
		console.log('function run');
	};
	console.log('Container Rendered');
	return (
		<TestProvider>
			<Layout>
				<div
					onClick={() => {
						setCount((p) => p + 1);
					}}
				>
					Container{count}
				</div>
				<Parent obj={obj} func={func}></Parent>
				<Uncle></Uncle>
				<Perspective>
					<PerspectiveChild></PerspectiveChild>
					<div className="childd">
						<div className="childdd"></div>
					</div>
				</Perspective>
				{/* <PerspectiveParent>
					<div className="FirstChild"></div>
					<div className="SecondChild"></div>
				</PerspectiveParent>
				<Card />
				<ComponentWithFunction />
				<AnimatedComp className={direction} $direction={direction}>
					<button
						onClick={() => {
							setDirection((p) => (p === 'normal' ? 'reverse' : 'normal'));
						}}
					>
						<div>turn</div>
					</button>
				</AnimatedComp>
				BorderGame
				<BoardLayout>
					<ShadowOnlyElement></ShadowOnlyElement>
					<Child />
					<Middle />
					<Child />
				</BoardLayout> */}
			</Layout>
		</TestProvider>
	);
};

export default Test;
