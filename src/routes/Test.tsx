/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

const Layout = styled.section`
	background-color: var(--bgColor-dark);
	color: #eaeaea;
	height: 100vh;
	width: 100%;
	font-size: 5rem;
	font-weight: 800;
	position: relative;
	display: flex;
	flex-direction: column;
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

/* TestComp가 마운트될 때, 모든 클래스에 대한 함수가 실행된다. */
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

/* 애니메이션이 실행될 때 animation-direction속성을 'reverse' 변경하면,
애니메이션은 바뀐 direction으로 키프레임이 실행된 상태에서 진행된다.
ex) 4초간 애니메이션을 실행하고 'reverse'상태가 되면 'reverse'로 4초간 실행된 시점으로 박스가 순간이동한다.
keyframes라는 이름을 생각하면 알 수 있는 부분. */
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

/* Arrow function은 클로저함수처럼 렉시컬 스코프를 가지기 때문에, 객체의 메서드로 활용될 때는 전역 스코프를 가지게 된다.
그래서 메서드로 활용된 Arrow function의 this값은 불안정하다. 전역이 global이냐 window냐에 따라 다르고, strict mode가
활성화되어있을 경우에는 전역객체에 대한 this는 undefined가 된다. 반면 일반함수(함수 선언형)의 경우 호출되는 방식에
따라 동적으로 this를 결정하는데, function();과 같은 일반적인 호출에서는 전역객체를 this로 갖고,
obj.function();처럼 객체의 메서드로 활용되었을 경우에는 해당 객체를 this로 갖는다. */
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
 *  이벤트가 일어나는 범위는 자식의 범위까지 포함되고, 이는 자식 요소가 부모 요소를 벗어나 있더라도 인정된다.
 *  onMouseOver이벤트에서 parent요소에 마우스를 이동시켜 onMouseOver를 작동시키고 아래에 있는 child요소에 마우스를 이동시켜도
 *  parent요소의 onMouseOver가 발생하는 것을 이벤트 버블링이라고 한다. (자식컴포넌트의 이벤트가 상위컴포넌트로 전파)
 *  이벤트 전파가 발생하는 컴포넌트의 nagative event객체에서 stopPropagation메서드 호출로 전파를 막을 수 있다.
 * */
const Card = () => {
	const onCardOver = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, clientY } = event;
		const { left, top } = event.currentTarget.getBoundingClientRect();
		console.log(left - clientX, top - clientY);
	};
	const onCardOver2 = (event: React.MouseEvent<HTMLDivElement>) => {
		const { clientX, clientY } = event;
		const { left, top } = event.currentTarget.getBoundingClientRect();
		console.log(left - clientX, top - clientY);
	};
	return (
		<div
			onMouseEnter={onCardOver}
			style={{
				width: '200px',
				height: '320px',
				color: 'red',
				backgroundColor: 'yellow',
			}}
		>
			<div
				onMouseEnter={onCardOver2}
				style={{ width: '400px', height: '200px', backgroundColor: 'blue' }}
			></div>
			card
		</div>
	);
};

const Test = () => {
	const [direction, setDirection] = useState<'normal' | 'reverse'>('normal');
	return (
		<Layout>
			{/* log : One, Two, Three */}
			<ComponentWithFunction />
			{/* 애니메이션의 재실행을 위해서는 동적으로 key값을 바꾸거나 class를 분기하면된다. */}
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
				<Child />
				<Middle />
				<Child />
			</BoardLayout>
		</Layout>
	);
};

export default Test;
