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

type OwnableSelecteds = Record<PlayerElement, Selected>;

/** Function Props Types */

interface resultSelectedsProps {
	direction: Direction;
	border: BorderState | undefined;
	box: number[];
	boxIndex: number;
	accumulator: Selected;
}

interface CreateResultSelectedsProps {
	direction: Direction;
	originalSelecteds: Selected;
	mergeableSelecteds: Selected;
}

interface CreateNewPlayerInfoProps {
	player: PlayerElement;
	playerInfos: Players;
	boxesResult: Boxes;
	ownableSelecteds: OwnableSelecteds;
	opt: { withBoxCount: boolean };
}

interface IsMergeableSelected {
	direction: Direction;
	sourceSelecteds: Selected;
	player: PlayerElement;
	sourceBoxes: Boxes;
}

interface FormatUnownedSelecteds {
	direction: Direction;
	unownedSelecteds: BorderStateWithDirection[];
	currentPlayer: PlayerElement;
}

interface FindUnownedRecursive {
	sourceSelecteds: BorderStateWithDirection[];
	originalSelecteds: Selected;
	currentPlayer: PlayerElement;
	recursive: boolean;
}

interface GetUnblockedSelectedsProp {
	border: number;
	side: number;
	direction: Direction;
	objectPos: HorizontalPos;
	player: PlayerElement;
}

interface BoxToBorderProps {
	boxIndex: number;
	direction: 'left' | 'right' | 'up' | 'down';
	isSelected: boolean;
	isMergeable: boolean;
	owner: PlayerElement;
	sourceSelecteds: Selected;
}

interface FindExistSidesProps extends BorderAndSide {
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

interface CanClickWhenBlockedProps extends IsBlockedProps {
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
	$isOwnable: boolean;
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
