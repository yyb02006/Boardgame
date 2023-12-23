type Direction = 'horizontal' | 'vertical';

type HorizontalPos = 'left' | 'right';

type NestedArray<T> = T[][];

interface DirectionInterface {
	direction: Direction;
}

interface ClosedBoxes {
	arr: NestedArray<number>;
	label: 'horizontal' | 'vertical';
}

type GetEnclosedBoxResult = Record<Direction, NestedArray<number>>;

type UnownedSelecteds = Record<
	'includeDefault' | 'notIncludeDefault',
	Selected
>;

interface IsBlockedProps {
	border: number;
	side: number;
	direction: Direction;
	objectPos: HorizontalPos;
}

interface BorderStateWithDirection extends BorderState {
	direction: Direction;
}

/** Styled Components Types */

interface PlayerProps {
	$currentPlayer: PlayerElement;
}

interface PlayerCardStyleProps {
	$player: PlayerElement;
}

interface BoardItemsContainerProps {
	$currentPlayer: PlayerElement;
}

interface BoxesProps {
	$isSurrounded: boolean;
	$currentPlayer: PlayerElement;
	$owner: PlayerElement | undefined;
}

interface BoardBordersContainerProps {
	$borderDirection: string;
}

interface BoxWrapperProps extends DirectionInterface {
	$isLast: boolean;
}

interface BoxHoverProps extends DirectionInterface {
	$isSelected: boolean;
	$currentPlayer: PlayerElement;
	$owner: PlayerElement;
	$isMergeable: boolean;
}

/** Routes Components Types */

interface BoxCollectionProps {
	direction: Direction;
	borderId: number;
	isLast?: boolean;
}

interface BorderBoxProps {
	direction: Direction;
}
