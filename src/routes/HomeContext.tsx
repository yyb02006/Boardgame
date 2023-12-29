import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<HomeContextType | undefined>(undefined);

function HomeProvider({ children }: { children: React.ReactNode }) {
	const [currentPlayer, setCurrentPlayer] = useState<PlayerElement>('player1');
	const [players, setPlayers] = useState<Players>({
		player1: {
			boxCount: 0,
			ownableBoxCount: 0,
			name: 'player1',
			ownableSelecteds: { horizontal: [], vertical: [] },
			isWin: false,
		},
		player2: {
			boxCount: 0,
			ownableBoxCount: 0,
			name: 'player2',
			ownableSelecteds: { horizontal: [], vertical: [] },
			isWin: false,
		},
	});
	const [selected, setSelected] = useState<Selected>({
		vertical: [],
		horizontal: [],
	});
	const [boxes, setBoxes] = useState<Boxes>(
		Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
			owner: undefined,
		}))
	);
	const [gameState, setGameState] = useState<GameState>({
		playState: 'playing',
		isPlayerWin: { player1: false, player2: false },
	});

	const contextValue: HomeContextType = {
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
	};

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
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
