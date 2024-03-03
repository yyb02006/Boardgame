type PlayState = 'win' | 'draw' | 'playing' | 'ready';

type Seconds = number;

type PageState = 'home' | 'borderGame' | 'cardFlipper' | 'othello';

/* App's Context Types */

interface AppContext {
  pageState: PageState;
  setPageState: React.Dispatch<React.SetStateAction<PageState>>;
}

/* CardFlipper's Context Types */

type PrevCard = [number] | [];

interface Card {
  cardId: number;
  order: 1 | 2;
  isChecked: boolean;
  isFlipped: boolean;
}

interface CardFlipperGameState {
  playState: Exclude<PlayState, 'draw'>;
  quantity: CardQuantity | null;
}

interface CardFlipperContext {
  gameState: CardFlipperGameState;
  setGameState: React.Dispatch<React.SetStateAction<CardFlipperGameState>>;
  cards: Card[] | null;
  setCards: React.Dispatch<React.SetStateAction<Card[] | null>>;
  prevCard: PrevCard;
  setPrevCard: React.Dispatch<React.SetStateAction<PrevCard>>;
  isUnmatchedCardFlipping: boolean;
  setIsUnmatchedCardFlipping: React.Dispatch<React.SetStateAction<boolean>>;
  flipCount: number;
  setFlipCount: React.Dispatch<React.SetStateAction<number>>;
  lazyPlayState: Exclude<PlayState, 'draw'>;
  initializeGameData: () => void;
}

/* BorderGame's Context Types */

type Selected = Record<Direction, BorderState[]>;

type PlayerElement = 'player1' | 'player2';

type Ownable = Record<PlayerElement, boolean>;

type Players = Record<PlayerElement, PlayerInfo>;

type Boxes = Array<{
  id: number;
  isPartialSurrounded: boolean;
  isSurrounded: boolean;
  owner: PlayerElement | undefined;
}>;

type InitialHomeData = [PlayerElement, Players, Selected, Boxes, GameState, Seconds];

interface PlayerInfo {
  boxCount: number;
  ownableBoxCount: number;
  name: string;
  ownableSelecteds: Selected;
  isWin: boolean;
  hasError: boolean;
}

interface GameState {
  playState: PlayState;
  isPlayerWin: Record<PlayerElement, boolean>;
}

interface HomeContext {
  initialData: {
    initialCurrentPlayer: PlayerElement;
    initialPlayers: Players;
    initialSelected: Selected;
    initialBoxes: Boxes;
    initialGameState: GameState;
    initialSeconds: Seconds;
  };
  initializeIngame: () => void;
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
  lazyPlayState: PlayState;
}

interface BorderState {
  border: number;
  side: number;
  isSelected: boolean;
  owner: PlayerElement;
  isMergeable: boolean;
  ownable: Ownable;
}
