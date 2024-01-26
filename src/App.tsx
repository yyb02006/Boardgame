import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '#components/Header';
import Home from '#routes/Home';
import Test from '#routes/Test';
import GlobalStyle from '#GlobalStyle';
import CardFlipper from '#routes/CardFlipper';
import { AppProvider } from '#AppContext';
import Othello from '#routes/Othello';

export default function App() {
	return (
		<BrowserRouter>
			<GlobalStyle />
			<AppProvider>
				<div className="App" style={{ position: 'relative' }}>
					<Header title={'BorderGame'} />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/card-flipper" element={<CardFlipper />} />
						<Route path="/othello" element={<Othello />} />
						<Route path="/test" element={<Test />} />
					</Routes>
				</div>
			</AppProvider>
		</BrowserRouter>
	);
}
