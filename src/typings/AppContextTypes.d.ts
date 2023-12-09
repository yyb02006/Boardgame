/** ContextAPI types definition */
interface AppContextType {
	currentPlayer: player;
	setCurrentPlayer: React.Dispatch<React.SetStateAction<player>>;
	selected: selected;
	setSelected: React.Dispatch<React.SetStateAction<selected>>;
	boxes: boxes;
	setBoxes: React.Dispatch<React.SetStateAction<boxes>>;
}

interface selected {
	vertical: borderState[];
	horizontal: borderState[];
}

type player = 'player1' | 'player2';

type boxes = Array<{
	id: number;
	isPartialSurrounded: boolean;
	isSurrounded: boolean;
}>;
