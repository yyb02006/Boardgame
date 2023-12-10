type direction = 'horizontal' | 'vertical';

interface directionInterface {
	direction: direction;
}

/** Styled Components Types */

interface BoardLayoutProps {
	$currentPlayer: currentPlayer;
}

interface BoxesProps {
	$isSurrounded: boolean;
	$currentPlayer: currentPlayer;
}

interface BoardBordersContainerProps {
	$borderDirection: string;
}

interface BoxWrapperProps extends directionInterface {
	$isLast: boolean;
}

interface BoxHoverProps extends directionInterface {
	$isSelected: boolean;
	$currentPlayer: currentPlayer;
	$owner: currentPlayer;
}

/** Components Types */

interface boxCollectionProps {
	direction: direction;
	borderId: number;
	isLast?: boolean;
}

interface borderBoxProps {
	direction: direction;
}
