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
    animation: ${`slideIn_${name}_${seqDirection}_${distance}_${direction}`} ${duration}ms
      ${delay}ms ease-in-out forwards;
    animation-direction: ${seqDirection};
  `;
}

export function fadeInZ({
  name,
  seqDirection,
  distance,
  duration,
  isFaded = true,
  delay = 0,
}: Omit<SlideInProps, 'direction'>) {
  return css`
    @keyframes fadeIn_${name}_${seqDirection}_${distance} {
      from {
        transform: perspective(1000px) translateZ(0px);
        ${isFaded &&
        css`
          opacity: 1;
        `}
      }
      to {
        transform: perspective(1000px) translateZ(${`${distance}px`});
        ${isFaded &&
        css`
          opacity: 0;
        `}
      }
    }
    animation: ${`fadeIn_${name}_${seqDirection}_${distance}`} ${duration}ms ${delay}ms
      ${seqDirection} ease-in forwards;
  `;
}

export function rotate({
  name,
  degree,
  duration,
  delay,
  timingFunc,
}: {
  name: string;
  degree: number;
  duration: number;
  delay: number;
  timingFunc: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}) {
  return css`
    @keyframes rotate_${name}_${degree} {
      from {
        transform: rotate(0);
      }
      to {
        transform: ${`rotate(${degree}deg)`};
      }
    }
    animation: ${`rotate_${name}_${degree}`} ${duration}ms ${delay}ms ${timingFunc} forwards;
  `;
}

const categorizeByProperty = (targetProperty: ColorProperties, color: string) => {
  switch (targetProperty) {
    case 'backgroundColor':
      return css`
        background-color: ${color};
      `;
    case 'borderColor':
      return css`
        border-color: ${color};
      `;
    case 'color':
      return css`
        color: ${color};
      `;
    default:
      break;
  }
};

export function colorBlink({
  name,
  startColor,
  alternateColor,
  duration,
  targetProperty,
}: ColorBlinkProps) {
  return css`
    @keyframes colorBlink_${name}_${startColor.slice(1)}_${alternateColor.slice(1)} {
      from {
        ${categorizeByProperty(targetProperty, startColor)}
      }
      to {
        ${categorizeByProperty(targetProperty, alternateColor)}
      }
    }
    animation: ${`colorBlink_${name}_${startColor.slice(1)}_${alternateColor.slice(1)}`} ease-in-out
      ${duration}ms infinite alternate;
  `;
}

export function alert({
  name,
  startColor,
  alternateColor,
  duration,
  targetProperty,
}: ColorBlinkProps) {
  return css`
    @keyframes alert_${name}_${startColor.slice(1)}_${alternateColor.slice(1)} {
      from {
        ${categorizeByProperty(targetProperty, startColor)}
      }
      to {
        ${categorizeByProperty(targetProperty, alternateColor)}
      }
    }
    animation: ${`alert_${name}_${startColor.slice(1)}_${alternateColor.slice(1)}`} linear
      ${duration}ms alternate;
    animation-iteration-count: 4;
  `;
}
