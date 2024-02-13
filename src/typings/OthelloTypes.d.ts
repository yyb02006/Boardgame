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
}

/** Function Props Types */

type SetSquareStateCallback = (p: SquareStates[]) => SquareStates[];

interface UpdateStatesProps {
	setSquareStateCallback: SetSquareStateCallback;
	nextPlayer: PlayerElement;
}

interface SquareStates {
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
	setGameState: React.Dispatch<React.SetStateAction<OthelloGameState>>;
	gameState: OthelloGameState;
	lazyPlayState: OthelloPlayState;
}

interface PlayerCardProps {
	playerData: PlayerData;
	gameState: OthelloGameState;
	currentPlayer: PlayerElement;
	seconds: number;
}

interface GameBoardProps {
	squareStates: SquareStates[];
	currentPlayer: PlayerElement;
	setSquareStates: React.Dispatch<React.SetStateAction<SquareStates[]>>;
	setPlayersData: SetPlayersData;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<PlayerElement>>;
	setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

interface SquareProps {
	squareStates: SquareStates[];
	updateStates: ({ setSquareStateCallback, nextPlayer }: UpdateStatesProps) => void;
	setPlayersData: SetPlayersData;
	currentSquare: SquareStates;
	currentPlayer: PlayerElement;
}
