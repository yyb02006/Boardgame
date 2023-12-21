type direction = 'horizontal' | 'vertical';

type nestedArray<T> = T[][];

interface directionInterface {
	direction: direction;
}

interface closedBoxes {
	arr: nestedArray<number>;
	label: 'horizontal' | 'vertical';
}

interface getEnclosedBoxResult {
	horizontal: nestedArray<number>;
	vertical: nestedArray<number>;
}

interface unownedSelecteds {
	includeDefault: selected;
	notIncludeDefault: selected;
}

/** Styled Components Types */

interface PlayerProps {
	$currentPlayer: currentPlayer;
}

interface PlayerCardStyleProps {
	$player: currentPlayer;
}

interface BoardItemsContainerProps {
	$currentPlayer: currentPlayer;
}

interface BoxesProps {
	$isSurrounded: boolean;
	$currentPlayer: currentPlayer;
	$owner: currentPlayer | undefined;
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
	$isMergeable: boolean;
}

/** Routes Components Types */

interface boxCollectionProps {
	direction: direction;
	borderId: number;
	isLast?: boolean;
}

interface borderBoxProps {
	direction: direction;
}
