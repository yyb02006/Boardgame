type Owner = PlayerElement | 'unowned';

type SquaresDirection = 'column' | 'row';

type Boundary = 'lower' | 'upper';

type OthelloPlayState = 'ready' | 'playing' | 'decided';

type Winner = 'player1' | 'player2' | 'draw' | 'undecided';

type SetPlayersData = React.Dispatch<React.SetStateAction<Record<PlayerElement, PlayerData>>>;

interface OthelloGameState {
	playState: OthelloPlayState;
	winner: Winner;
}

interface PlayerData {
	index: PlayerElement;
	name: string;
	score: number;
	takeOverChance: number;
	error: string;
	hasFlippable: boolean;
	isPassed: boolean;
	isTakeoverEnabled: boolean;
}

interface initialStates {
	currentPlayer: PlayerElement;
	squareStates: SquareState[];
	playerData: Record<PlayerElement, PlayerData>;
	seconds: number;
	gameState: OthelloGameState;
}

/** Function Props Types */

type SetSquareStateCallback = (p: SquareState[]) => SquareState[];

interface UpdateStatesProps {
	setSquareStateCallback: SetSquareStateCallback;
	nextPlayer: PlayerElement;
}

interface SquareState {
	index: number;
	initPlayer: Owner;
	owner: Owner;
	isFlipped: boolean;
	flippable: boolean;
	isPrev: boolean;
}

/** Styled Components Types */

interface PlayerCardLayoutProps {
	$player: PlayerElement;
	$currentPlayer: PlayerElement;
	$playState: OthelloPlayState;
	$hasError: boolean;
}

interface SquareStyleProps {
	$owner: Owner;
	$initPlayer: Owner;
	$isHovered: boolean;
	$currentPlayer: PlayerElement;
	$flippable: boolean;
}

interface LobbyLayoutProps {
	$onSlideIn: boolean;
}

interface LobbyCoverProps {
	$index: number;
	$direction: HorizontalPos | VerticalPos;
	$winner: Winner;
	$playState: OthelloPlayState;
}

/** React Components Types */

interface LobbyProps {
	gameState: OthelloGameState;
	lazyPlayState: OthelloPlayState;
	setGameState: React.Dispatch<React.SetStateAction<OthelloGameState>>;
	initializeStates: () => void;
}

interface PlayerCardProps {
	playerData: PlayerData;
	gameState: OthelloGameState;
	currentPlayer: PlayerElement;
	seconds: number;
	setPlayersData: SetPlayersData;
}

interface GameBoardProps {
	squareStates: SquareState[];
	currentPlayer: PlayerElement;
	playerData: Record<PlayerElement, PlayerData>;
	setSquareStates: React.Dispatch<React.SetStateAction<SquareState[]>>;
	setPlayersData: SetPlayersData;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<PlayerElement>>;
	setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

interface SquareProps {
	squareStates: SquareState[];
	updateStates: ({ setSquareStateCallback, nextPlayer }: UpdateStatesProps) => void;
	setPlayersData: SetPlayersData;
	currentSquare: SquareState;
	currentPlayer: PlayerElement;
	playerData: Record<PlayerElement, PlayerData>;
}
