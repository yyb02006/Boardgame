type Owner = PlayerElement | 'unowned';

interface squareSetStateAction {
	setSquareStates: React.Dispatch<React.SetStateAction<SquareStates[]>>;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<PlayerElement>>;
}

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
	setStateAction: squareSetStateAction;
	currentPlayer: PlayerElement;
}
