import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
	const [pageState, setPageState] = useState<PageState>('home');
	const contextValue = { pageState, setPageState };
	return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
	const contextValue = useContext(AppContext);
	if (contextValue === undefined) {
		throw new Error('useAppContext must be used within a AppProvider');
	}
	return contextValue;
}
