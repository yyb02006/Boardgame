import { type DebouncedFunc } from 'lodash';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line space-before-function-paren
export default function useThrottleClear<T extends (...args: unknown[]) => void>(
	currentThrottle: DebouncedFunc<T>,
	depsArray: unknown[]
) {
	const prevThrottle = useRef<DebouncedFunc<T>>();
	useEffect(() => {
		if (prevThrottle.current) {
			prevThrottle.current.cancel();
		}
		prevThrottle.current = currentThrottle;
	}, [currentThrottle, ...depsArray]);
}
