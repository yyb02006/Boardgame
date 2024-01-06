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
