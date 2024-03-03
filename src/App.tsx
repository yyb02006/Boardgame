import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '#components/Header';
import GlobalStyle from '#GlobalStyle';
import CardFlipper from '#routes/CardFlipper';
import { AppProvider } from '#AppContext';
import Othello from '#routes/Othello';
import BorderGame from '#routes/BorderGame';
import Home from '#routes/Home';
import { HelmetProvider } from 'react-helmet-async';

const withHeader = (component: React.ReactNode, title: string) => {
  return (
    <>
      <Header title={title} />
      {component}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <HelmetProvider>
        <AppProvider>
          <div className="App" style={{ position: 'relative' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/border-game" element={withHeader(<BorderGame />, 'BorderGame')} />
              <Route path="/card-flipper" element={withHeader(<CardFlipper />, 'CardFlipper')} />
              <Route path="/othello" element={withHeader(<Othello />, 'Othello')} />
            </Routes>
          </div>
        </AppProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}
