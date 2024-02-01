type Owner = PlayerElement | 'unowned';

/** Function Props Types */

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
	setStateAction: (owner: Owner, index: number) => void;
	currentPlayer: PlayerElement;
}
