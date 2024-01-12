import { useEffect, useState } from 'react';

export default function useLazyState<T>(term: number, target: T, init: T) {
	const [lazyState, setLazyState] = useState(init);
	useEffect(() => {
		const timeout = setTimeout(() => {
			setLazyState(target);
		}, term);
		return () => {
			clearTimeout(timeout);
		};
	}, [target, term]);
	return lazyState;
}
