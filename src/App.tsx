import React, { Component } from "react";
import { StoreProvider } from "easy-peasy";

import store from "./store";
import ToDoComponent from "./ToDoComponent";
import logo from "./assets/peas.png";
import "./assets/App.css";

function App() {
  return (
    <StoreProvider store={store}>
      <div className="app">
        <header>
          <img src={logo} alt="easy peasy" />
        </header>
        <ToDoComponent />
      </div>
    </StoreProvider>
  );
}

export default App;
