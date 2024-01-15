type Direction = 'horizontal' | 'vertical';

type HorizontalPos = 'left' | 'right';

type VerticalPos = 'up' | 'down';

type Position = HorizontalPos | VerticalPos;

type NestedArray<T> = T[][];

type SeqDirection = 'reverse' | 'normal';

type SeqPlayState = 'paused' | 'running';

type PartialCoverClass = 'Draw' | 'Win' | 'Start' | '';

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

interface GetVulnerableBoxesProps {
	ownableAndOwnedBoxes: number[];
	opponentOwnableSelecteds: BorderStateWithDirection[];
}

interface ResultSelectedsProps {
	direction: Direction;
	border: BorderState | undefined;
	boxes: number[];
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
	originalSelecteds: Selected;
	opt: { withBoxCount: boolean };
}

interface IsMergeableSelected {
	direction: Direction;
	sourceSelecteds: Selected;
	player: PlayerElement;
	sourceBoxes: Boxes;
}

interface FormatOwnableSelecteds {
	direction: Direction;
	ownableSelecteds: BorderStateWithDirection[];
	player: PlayerElement;
}

interface FindOwnableRecursive {
	sourceSelecteds: BorderStateWithDirection[];
	originalSelecteds: Selected;
	player: PlayerElement;
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
	position: Position;
	isSelected?: boolean;
	isMergeable?: boolean;
	owner?: PlayerElement;
	originalSelecteds: Selected;
}

interface FindExistSidesProps extends BorderAndSide {
	sidePos: HorizontalPos;
	owner: 'current' | 'other' | 'all';
	selectedDirection: Direction;
	originalSelecteds: Selected;
	player: PlayerElement;
}

interface ShouldAbortProps extends BorderAndSide {
	selected: Selected;
	direction: Direction;
	originalSelecteds: Selected;
	currentPlayer: PlayerElement;
	playState: PlayState;
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
	originalSelecteds: Selected;
	player: PlayerElement;
}

interface CanClickWhenBlockedProps extends IsBlockedProps {}

/** Styled Components Types */

interface PartialCoverProps {
	$aniDirection: HorizontalPos | VerticalPos;
	$winner: PlayerElement | undefined;
}

interface PlayerProps {
	$currentPlayer: PlayerElement;
}

interface PlayerCardStyleProps {
	$player: PlayerElement;
	$playState: PlayState;
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
	$playState: PlayState;
}

/** React Components Types */

interface BoxCollectionProps {
	direction: Direction;
	borderId: number;
	isLast?: boolean;
}

interface BorderBoxProps {
	direction: Direction;
}

interface BoardCoverProps {
	playState: Exclude<PlayState, 'playing'>;
	isPlayerWin: Record<PlayerElement, boolean>;
}
