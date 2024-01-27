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
	$onwer: Owner;
	$initPlayer: Owner;
	$isHovered: boolean;
	$currentPlayer: PlayerElement;
}

/** React Components Types */

interface SquareProps extends SquareStates {
	setSquareStates: React.Dispatch<React.SetStateAction<SquareStates[]>>;
	currentPlayer: PlayerElement;
}
