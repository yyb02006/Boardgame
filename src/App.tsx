import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '#components/Header';
import Test from '#routes/Test';
import GlobalStyle from '#GlobalStyle';
import CardFlipper from '#routes/CardFlipper';
import { AppProvider } from '#AppContext';
import Othello from '#routes/Othello';
import BorderGame from '#routes/BorderGame';
import Home from '#routes/Home';

const withHeader = (component: React.ReactNode) => {
	return (
		<>
			<Header title={'BorderGame'} />
			{component}
		</>
	);
};

export default function App() {
	return (
		<BrowserRouter>
			<GlobalStyle />
			<AppProvider>
				<div className="App" style={{ position: 'relative' }}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/border-game" element={withHeader(<BorderGame />)} />
						<Route path="/card-flipper" element={withHeader(<CardFlipper />)} />
						<Route path="/othello" element={withHeader(<Othello />)} />
						<Route path="/test" element={<Test />} />
					</Routes>
				</div>
			</AppProvider>
		</BrowserRouter>
	);
}
