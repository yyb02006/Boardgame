interface SlideInProps {
	name: string;
	seqDirection: 'reverse' | 'normal';
	distance: number;
	direction: Direction;
	duration: number;
}

interface ColorBlinkProps {
	name: string;
	startColor: string;
	alternateColor: string;
	duration: number;
}
