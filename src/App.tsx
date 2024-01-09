import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '#components/Header';
import Home from '#routes/Home';
import Test from '#routes/Test';
import GlobalStyle from '#GlobalStyle';
import CardFlipper from '#routes/CardFlipper';

export default function App() {
	return (
		<BrowserRouter>
			<GlobalStyle />
			<div className="App" style={{ position: 'relative' }}>
				<Header title={'BorderGame'} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/card-flipper" element={<CardFlipper />} />
					<Route path="/Test" element={<Test />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
