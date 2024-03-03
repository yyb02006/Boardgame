import useLazyState from '#hooks/useLazyState';
import React, { createContext, useState, useContext } from 'react';

const CardFlipperContext = createContext<CardFlipperContext | undefined>(undefined);

export function CardFlipperProvider({ children }: { children: React.ReactNode }) {
  const [initialGameState, initialCards, initialPrevCard, initialIsUCF, initialFlipCount]: [
    CardFlipperGameState,
    null,
    [],
    boolean,
    number,
  ] = [{ playState: 'ready', quantity: null }, null, [], false, 0];
  const [gameState, setGameState] = useState<CardFlipperGameState>(initialGameState);
  const [cards, setCards] = useState<Card[] | null>(initialCards);
  const [prevCard, setPrevCard] = useState<PrevCard>(initialPrevCard);
  const [isUnmatchedCardFlipping, setIsUnmatchedCardFlipping] = useState<boolean>(initialIsUCF);
  const [flipCount, setFlipCount] = useState(initialFlipCount);
  const lazyPlayState = useLazyState(600, gameState.playState, 'ready');
  const initializeGameData = () => {
    setGameState(initialGameState);
    setCards(initialCards);
    setPrevCard(initialPrevCard);
    setIsUnmatchedCardFlipping(initialIsUCF);
    setFlipCount(initialFlipCount);
  };
  const contextValue: CardFlipperContext = {
    gameState,
    setGameState,
    cards,
    setCards,
    prevCard,
    setPrevCard,
    isUnmatchedCardFlipping,
    setIsUnmatchedCardFlipping,
    flipCount,
    setFlipCount,
    lazyPlayState,
    initializeGameData,
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
