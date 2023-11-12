/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';

const ChildComponent = ({ handleFn }: { handleFn: () => void }) => {
	console.log('ChildComponent is Rendered!');

	return (
		<div>
			<button
				style={{
					width: '100px',
					height: '100px',
					top: '100px',
					position: 'relative',
				}}
				onClick={handleFn}
			>
				Click
			</button>
		</div>
	);
};

const Child = React.memo(ChildComponent);

const ParentComponent = () => {
	const [clicked, setClicked] = useState(false);
	console.log('ParentComponent is Rendered!');
	/* const handleClick = () => {
		setClicked((p) => !p);
		console.log('button Clicked');
	}; */
	const handleClick = useCallback(() => {
		setClicked((p) => !p);
		console.log('Button Clicked');
	}, []);

	return (
		<div>
			<Child handleFn={handleClick}></Child>
		</div>
	);
};

const Test = () => {
	const [render, setRender] = useState(false);
	console.log(render);

	return (
		<article>
			<ParentComponent />
			<button
				style={{
					width: '100px',
					height: '100px',
					top: '100px',
					position: 'relative',
				}}
				onClick={() => {
					setRender((p) => !p);
				}}
			>
				Render
			</button>
		</article>
	);
};

export default Test;
