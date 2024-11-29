import React from 'react';
import logo from './logo.svg';
import './App.css';
import SudokuBoard from './Components/SudokuBoard';
function App() {
  return (
    <div className="App">
    <h1>Sudoku Game</h1>
    <SudokuBoard />
  </div>
  );
}

export default App;
