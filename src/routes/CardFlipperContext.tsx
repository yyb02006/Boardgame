import useLazyState from '#hooks/useLazyState';
import React, { createContext, useState, useContext } from 'react';

const CardFlipperContext = createContext<CardFlipperContext | undefined>(undefined);

export function CardFlipperProvider({ children }: { children: React.ReactNode }) {
	const [initialGameState]: [CardFlipperGameState] = [{ playState: 'ready', quantity: null }];
	const [gameState, setGameState] = useState<CardFlipperGameState>(initialGameState);
	const [cards, setCards] = useState<Card[] | null>(null);
	const lazyPlayState = useLazyState(600, gameState.playState, 'ready');
	const contextValue: CardFlipperContext = {
		gameState,
		setGameState,
		cards,
		setCards,
		lazyPlayState,
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
