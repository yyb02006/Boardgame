import { css } from 'styled-components';

export function slideIn({
	name,
	seqDirection,
	distance,
	direction,
	duration,
	isFaded = true,
	delay = 0,
}: SlideInProps) {
	return css`
		@keyframes slideIn_${name}_${seqDirection}_${distance}_${direction} {
			from {
				transform: translate(
					${direction === 'horizontal' ? `${distance}px, 0px` : `0px, ${distance}px`}
				);
				${isFaded &&
				css`
					opacity: 0;
				`}
			}
			to {
				transform: translate(0px);
				${isFaded &&
				css`
					opacity: 1;
				`}
			}
		}
		animation: ${`slideIn_${name}_${seqDirection}_${distance}_${direction}`} ${duration}s ${delay}s
			ease-in-out forwards;
		animation-direction: ${seqDirection};
	`;
}

export function colorBlink({ name, startColor, alternateColor, duration }: ColorBlinkProps) {
	return css`
		@keyframes colorBlink_${name} {
			from {
				border-color: ${startColor};
			}
			to {
				border-color: ${alternateColor};
			}
		}
		animation: ${`colorBlink_` + name} ease-in-out ${duration}s infinite alternate;
	`;
}
