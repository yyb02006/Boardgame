interface selected {
	vertical: borderState[];
	horizontal: borderState[];
}

type currentPlayer = 'player1' | 'player2';

interface playerInfo {
	boxCount: number;
	name: string;
}

interface players {
	player1: playerInfo;
	player2: playerInfo;
}

type boxes = Array<{
	id: number;
	isPartialSurrounded: boolean;
	isSurrounded: boolean;
	owner: currentPlayer | undefined;
}>;

interface HomeContextType {
	currentPlayer: currentPlayer;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<currentPlayer>>;
	players: players;
	setPlayers: React.Dispatch<React.SetStateAction<players>>;
	selected: selected;
	setSelected: React.Dispatch<React.SetStateAction<selected>>;
	boxes: boxes;
	setBoxes: React.Dispatch<React.SetStateAction<boxes>>;
}

interface borderState {
	border: number;
	side: number;
	isSelected: boolean;
	owner: currentPlayer;
	isMergeable: boolean;
}
