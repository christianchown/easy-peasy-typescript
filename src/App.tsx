import React, { Component } from 'react';
import { StoreProvider } from 'easy-peasy';

import store from './store';
import ToDoComponent from './ToDoComponent';
import FormulaComponent from './FormulaComponent';
import logo from './assets/peas.png';
import './assets/App.css';

function App() {
  return (
    <StoreProvider store={store}>
      <div className="app">
        <header>
          <img src={logo} alt="easy peasy" />
        </header>
        <ToDoComponent />
        <FormulaComponent />
      </div>
    </StoreProvider>
  );
}

export default App;
