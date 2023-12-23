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

interface BorderAndSide {
	borderId: number;
	sideId: number;
}

type GetEnclosedBoxResult = Record<Direction, NestedArray<number>>;

interface BorderStateWithDirection extends BorderState {
	direction: Direction;
}

type UnownedSelecteds = Record<
	'includeDefault' | 'notIncludeDefault',
	Selected
>;

/** Function Props Types */

interface FindExistSideSelectedProps extends BorderAndSide {
	sidePos: 'left' | 'right';
	owner: 'current' | 'other' | 'all';
	selectedDirection: Direction;
	sourceSelecteds: Selected;
	sourcePlayer: PlayerElement;
}

interface ShouldAbortProps extends BorderAndSide {
	selected: Selected;
	direction: Direction;
	sourceSelecteds: Selected;
	currentPlayer: PlayerElement;
}

interface CreateBorderOrSideProps extends BorderAndSide {
	sidePos: HorizontalPos;
	direction: Direction;
	heightPos: 'middle' | 'top' | 'bottom';
}

interface IsBlockedProps {
	border: number;
	side: number;
	direction: Direction;
	objectPos: HorizontalPos;
}

interface IsNotClickableWhenBlockedProps extends IsBlockedProps {
	sourceSelecteds: Selected;
	currentPlayer: PlayerElement;
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
