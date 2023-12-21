import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<HomeContextType | undefined>(undefined);

function HomeProvider({ children }: { children: React.ReactNode }) {
	const [currentPlayer, setCurrentPlayer] = useState<currentPlayer>('player1');
	const [players, setPlayers] = useState<players>({
		player1: { boxCount: 0, name: 'player1' },
		player2: { boxCount: 0, name: 'player2' },
	});
	const [selected, setSelected] = useState<selected>({
		vertical: [],
		horizontal: [],
	});
	const [boxes, setBoxes] = useState<boxes>(
		Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
			owner: undefined,
		}))
	);

	const contextValue: HomeContextType = {
		currentPlayer,
		setCurrentPlayer,
		players,
		setPlayers,
		selected,
		setSelected,
		boxes,
		setBoxes,
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
