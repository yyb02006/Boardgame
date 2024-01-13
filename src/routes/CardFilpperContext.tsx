import React, { createContext, useState, useContext } from 'react';

const CardFlipperContext = createContext<CardFilpperContext | undefined>(undefined);

export function CardFlipperProvider({ children }: { children: React.ReactNode }) {
	const [initialGameState]: [Exclude<PlayState, 'draw'>] = ['ready'];
	const [gameState, setGameState] = useState<Exclude<PlayState, 'draw'>>(initialGameState);
	const contextValue: CardFilpperContext = {
		gameState,
		setGameState,
	};
	return <CardFlipperContext.Provider value={contextValue}>{children}</CardFlipperContext.Provider>;
}

export function useCardFlipperContext() {
	const contextValue = useContext(CardFlipperContext);
	if (contextValue === undefined) {
		throw new Error('useCardFlipperContext must be used within a CardFlipperProvider');
	}
	return contextValue;
}
