import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';
import GlobalStyle from './GlobalStyle';

export default function App() {
	return (
		<BrowserRouter>
			<GlobalStyle />
			<div className="App" style={{ position: 'relative' }}>
				<Header title={'BorderGame'} />
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
