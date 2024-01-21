import React, { createContext, useContext, useState } from 'react';

interface TestContextProps {
	contextVariable: number;
	setContextVariable: React.Dispatch<React.SetStateAction<number>>;
	contextSecond: number;
	setContextSecond: React.Dispatch<React.SetStateAction<number>>;
	contextObj: { a: string; b: number };
	setContextObj: React.Dispatch<React.SetStateAction<{ a: string; b: number }>>;
}

const TestContext = createContext<TestContextProps | undefined>(undefined);

export function TestProvider({ children }: { children: React.ReactNode }) {
	const [contextVariable, setContextVariable] = useState(0);
	const [contextSecond, setContextSecond] = useState(0);
	const [contextObj, setContextObj] = useState({ a: 'string', b: 1 });
	const contextValue: TestContextProps = {
		contextVariable,
		setContextVariable,
		contextSecond,
		setContextSecond,
		contextObj,
		setContextObj,
	};
	return <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>;
}

export function useTestContext() {
	const contextValue = useContext(TestContext);
	if (contextValue === undefined) {
		throw new Error('error');
	}
	return contextValue;
}
