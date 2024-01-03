type Selected = Record<Direction, BorderState[]>;

type PlayerElement = 'player1' | 'player2';

type Ownable = Record<PlayerElement, boolean>;

type PlayState = 'win' | 'draw' | 'playing';

type Seconds = number;

interface PlayerInfo {
	boxCount: number;
	ownableBoxCount: number;
	name: string;
	ownableSelecteds: Selected;
	isWin: boolean;
}

interface GameState {
	playState: PlayState;
	isPlayerWin: Record<PlayerElement, boolean>;
}

type Players = Record<PlayerElement, PlayerInfo>;

type Boxes = Array<{
	id: number;
	isPartialSurrounded: boolean;
	isSurrounded: boolean;
	owner: PlayerElement | undefined;
}>;

interface HomeContextType {
	currentPlayer: PlayerElement;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<PlayerElement>>;
	players: Players;
	setPlayers: React.Dispatch<React.SetStateAction<Players>>;
	selected: Selected;
	setSelected: React.Dispatch<React.SetStateAction<Selected>>;
	boxes: Boxes;
	setBoxes: React.Dispatch<React.SetStateAction<boxes>>;
	gameState: GameState;
	setGameState: React.Dispatch<React.SetStateAction<GameState>>;
	seconds: Seconds;
	setSeconds: React.Dispatch<React.SetStateAction<Seconds>>;
}

interface BorderState {
	border: number;
	side: number;
	isSelected: boolean;
	owner: PlayerElement;
	isMergeable: boolean;
	ownable: Ownable;
}
