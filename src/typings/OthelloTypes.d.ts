type Owner = PlayerElement | 'unowned';

type SquaresDirection = 'column' | 'row';

type Boundary = 'lower' | 'upper';

/** Function Props Types */

type updateStates = (p: SquareStates[]) => SquareStates[];

interface SquareStates {
	index: number;
	initPlayer: Owner;
	owner: Owner;
	isFlipped: boolean;
	flippable: boolean;
}

/** Styled Components Types */

interface SquareStyleProps {
	$owner: Owner;
	$initPlayer: Owner;
	$isHovered: boolean;
	$currentPlayer: PlayerElement;
}

/** React Components Types */

interface SquareProps {
	squareStates: SquareStates[];
	updateStates: (index: number, callback: updateStates) => void;
	currentSquare: SquareStates;
	currentPlayer: PlayerElement;
}
