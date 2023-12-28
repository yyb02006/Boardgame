type Selected = Record<Direction, BorderState[]>;

type PlayerElement = 'player1' | 'player2';

type Ownable = Record<PlayerElement, boolean>;

interface PlayerInfo {
	boxCount: number;
	ownableBoxCount: number;
	name: string;
	ownableSelecteds: Selected;
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
}

interface BorderState {
	border: number;
	side: number;
	isSelected: boolean;
	owner: PlayerElement;
	isMergeable: boolean;
	ownable: Ownable;
}
