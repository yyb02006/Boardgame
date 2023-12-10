import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppProvider({ children }: { children: React.ReactNode }) {
	const [currentPlayer, setCurrentPlayer] = useState<player>('player1');
	const [selected, setSelected] = useState<selected>({
		vertical: [],
		horizontal: [],
	});
	const [boxes, setBoxes] = useState<
		Array<{ id: number; isPartialSurrounded: boolean; isSurrounded: boolean }>
	>(
		Array.from({ length: 25 }, (_, id) => ({
			id,
			isPartialSurrounded: false,
			isSurrounded: false,
		}))
	);

	const contextValue: AppContextType = {
		currentPlayer,
		setCurrentPlayer,
		selected,
		setSelected,
		boxes,
		setBoxes,
	};

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
}

function useAppContext() {
	const contextValue = useContext(AppContext);
	/** undefined예외처리 */
	if (contextValue === undefined) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return contextValue;
}

export { AppProvider, useAppContext };
