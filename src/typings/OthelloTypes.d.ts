type Owner = PlayerElement | 'unowned';

/** Function Props Types */

type updateStates = (p: SquareStates[]) => SquareStates[];

interface SquareStates {
	index: number;
	initPlayer: Owner;
	owner: Owner;
	isFlipped: boolean;
}

/** Styled Components Types */

interface SquareStyleProps {
	$owner: Owner;
	$initPlayer: Owner;
	$isHovered: boolean;
	$currentPlayer: PlayerElement;
}

/** React Components Types */

interface SquareProps extends SquareStates {
	updateStates: (index: number, callback: updateStates) => void;
	currentPlayer: PlayerElement;
}
