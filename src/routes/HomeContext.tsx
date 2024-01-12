import useLazyState from '#hooks/useLazyState';
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<HomeContextType | undefined>(undefined);

function HomeProvider({ children }: { children: React.ReactNode }) {
	const initialPlayer = (name: PlayerElement) => ({
		boxCount: 0,
		ownableBoxCount: 0,
		name,
		ownableSelecteds: { horizontal: [], vertical: [] },
		isWin: false,
	});
	const initialData: InitialData = {
		initialCurrentPlayer: 'player1',
		initialPlayers: {
			player1: initialPlayer('player1'),
			player2: initialPlayer('player2'),
		},
		initialSelected: {
			vertical: [],
			horizontal: [],
		},
		initialBoxes: Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
			owner: undefined,
		})),
		initialGameState: {
			playState: 'ready',
			isPlayerWin: { player1: false, player2: false },
		},
		initialSeconds: 30,
	};
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>(
		initialData.initialCurrentPlayer
	);
	const [players, setPlayers] = useState<Players>(initialData.initialPlayers);
	const [selected, setSelected] = useState<Selected>(initialData.initialSelected);
	const [boxes, setBoxes] = useState<Boxes>(initialData.initialBoxes);
	const [gameState, setGameState] = useState<GameState>(initialData.initialGameState);
	const [seconds, setSeconds] = useState<Seconds>(initialData.initialSeconds);
	const lazyPlayState = useLazyState(600, gameState.playState, 'ready');

	const initializeIngame = () => {
		setPlayers(initialData.initialPlayers);
		setBoxes(initialData.initialBoxes);
		setCurrentPlayer(initialData.initialCurrentPlayer);
		setSelected(initialData.initialSelected);
		setSeconds(initialData.initialSeconds);
	};

	const contextValue: HomeContextType = {
		initialData,
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

	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

function useHomeContext() {
	const contextValue = useContext(AppContext);
	/** undefined예외처리 */
	if (contextValue === undefined) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return contextValue;
}

export { HomeProvider, useHomeContext };
