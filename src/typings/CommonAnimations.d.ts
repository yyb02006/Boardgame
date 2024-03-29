type ColorProperties = 'borderColor' | 'backgroundColor' | 'color';

interface SlideInProps {
	name: string;
	seqDirection: 'reverse' | 'normal';
	distance: number;
	direction: Direction;
	duration: number;
	isFaded?: boolean;
	delay?: number;
}

interface ColorBlinkProps {
	name: string;
	startColor: string;
	alternateColor: string;
	duration: number;
	targetProperty: ColorProperties;
}
