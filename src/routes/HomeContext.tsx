import useLazyState from '#hooks/useLazyState';
import React, { createContext, useContext, useState } from 'react';

const HomeContext = createContext<HomeContext | undefined>(undefined);

function HomeProvider({ children }: { children: React.ReactNode }) {
	const initialPlayer = (name: PlayerElement) => ({
		boxCount: 0,
		ownableBoxCount: 0,
		name,
		ownableSelecteds: { horizontal: [], vertical: [] },
		isWin: false,
	});
	const [
		initialCurrentPlayer,
		initialPlayers,
		initialSelected,
		initialBoxes,
		initialGameState,
		initialSeconds,
	]: [...InitialHomeData] = [
		'player1',
		{
			player1: initialPlayer('player1'),
			player2: initialPlayer('player2'),
		},
		{
			vertical: [],
			horizontal: [],
		},
		Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
			owner: undefined,
		})),
		{
			playState: 'ready',
			isPlayerWin: { player1: false, player2: false },
		},
		30,
	];
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>(initialCurrentPlayer);
	const [players, setPlayers] = useState<Players>(initialPlayers);
	const [selected, setSelected] = useState<Selected>(initialSelected);
	const [boxes, setBoxes] = useState<Boxes>(initialBoxes);
	const [gameState, setGameState] = useState<GameState>(initialGameState);
	const [seconds, setSeconds] = useState<Seconds>(initialSeconds);
	const lazyPlayState = useLazyState(600, gameState.playState, 'ready');

	const initializeIngame = () => {
		setPlayers(initialPlayers);
		setBoxes(initialBoxes);
		setCurrentPlayer(initialCurrentPlayer);
		setSelected(initialSelected);
		setSeconds(initialSeconds);
	};

	const contextValue: HomeContext = {
		initialData: {
			initialCurrentPlayer,
			initialPlayers,
			initialSelected,
			initialBoxes,
			initialGameState,
			initialSeconds,
		},
		initializeIngame,
		currentPlayer,
		setCurrentPlayer,
		players,
		setPlayers,
		selected,
		setSelected,
		boxes,
		setBoxes,
		gameState,
		setGameState,
		seconds,
		setSeconds,
		lazyPlayState,
	};

	return <HomeContext.Provider value={contextValue}>{children}</HomeContext.Provider>;
}

function useHomeContext() {
	const contextValue = useContext(HomeContext);
	/** undefined예외처리 */
	if (contextValue === undefined) {
		throw new Error('useHomeContext must be used within an HomeProvider');
	}
	return contextValue;
}

export { HomeProvider, useHomeContext };
