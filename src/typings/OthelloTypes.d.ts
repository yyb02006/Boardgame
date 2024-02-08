type Owner = PlayerElement | 'unowned';

type SquaresDirection = 'column' | 'row';

type Boundary = 'lower' | 'upper';

type SetPlayersData = React.Dispatch<React.SetStateAction<Record<PlayerElement, PlayerData>>>;

interface PlayerData {
	index: PlayerElement;
	name: string;
	score: number;
	takeOverChance: number;
}

type SettingTyps = 'paid' | 'vanilla' | 'free' | 'modded' | 'list';

/** Function Props Types */

type UpdateStates = (p: SquareStates[]) => SquareStates[];

interface SquareStates {
	index: number;
	initPlayer: Owner;
	owner: Owner;
	isFlipped: boolean;
	flippable: boolean;
}

/** Styled Components Types */

interface PlayerCardLayoutProps {
	$player: PlayerElement;
}

interface SquareStyleProps {
	$owner: Owner;
	$initPlayer: Owner;
	$isHovered: boolean;
	$currentPlayer: PlayerElement;
	$flippable: boolean;
}

/** React Components Types */

interface PlayerCardProps {
	playerData: PlayerData;
}

interface GameBoardProps {
	squareStates: SquareStates[];
	setSquareStates: React.Dispatch<React.SetStateAction<SquareStates[]>>;
	setPlayersData: SetPlayersData;
}

interface SquareProps {
	squareStates: SquareStates[];
	updateStates: (callback: UpdateStates) => void;
	setPlayersData: SetPlayersData;
	currentSquare: SquareStates;
	currentPlayer: PlayerElement;
}
