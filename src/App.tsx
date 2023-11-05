import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './routes/Home';

export default function App() {
	return (
		<BrowserRouter>
			<div className="App" style={{ position: 'relative' }}>
				<Header title={'BorderGame'} />
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}
