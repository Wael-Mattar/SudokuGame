import React, { useState } from 'react';
import SudokuCell from './SudokuCell';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { solveSudoku, getHint, validateBoard } from '../utils/sudokuSolver';
import Tesseract from 'tesseract.js';
import '../Styles/SudokuBoard.css';

const SudokuBoard: React.FC = () => {
  const [board, setBoard] = useState<(number | "")[][]>(generatePuzzle("easy"));
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [isSolved, setIsSolved] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const handleGeneratePuzzle = () => {
    setBoard(generatePuzzle(difficulty));
    setIsSolved(false);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as "easy" | "medium" | "hard");
  };

  const handleCellChange = (row: number, col: number, newValue: number | "") => {
    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? newValue : cell))
    );
    setBoard(newBoard);
  };

  const solveBoard = () => {
    if (validateBoard(board)) {
      const boardCopy = JSON.parse(JSON.stringify(board));
      if (solveSudoku(boardCopy)) {
        setBoard(boardCopy);
        setIsSolved(true);
      } else {
        alert("No solution exists for the current board.");
      }
    } else {
      alert("The board is invalid. Please correct conflicts before solving.");
    }
  };

  const revealHint = () => {
    if (validateBoard(board)) {
      const hintBoard = getHint(board);
      if (hintBoard) {
        setBoard([...hintBoard]);
      } else {
        alert("No hints available or no solution exists.");
      }
    } else {
      alert("The board is invalid. Please correct conflicts before requesting a hint.");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOcrLoading(true);
      setOcrError(null);

      Tesseract.recognize(file, 'eng')
        .then(({ data: { text } }) => {
          const parsedBoard = parseOcrToBoard(text);
          if (parsedBoard) {
            setBoard(parsedBoard);
            setIsSolved(false);
          } else {
            setOcrError("Unable to parse the Sudoku board from the image.");
          }
        })
        .catch((error) => {
          console.error("OCR Error:", error);
          setOcrError("Failed to process the image. Please try again with a clearer image.");
        })
        .finally(() => setOcrLoading(false));
    }
  };

  const parseOcrToBoard = (text: string): (number | "")[][] | null => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 9) return null; // Minimum 9 rows for a valid board

    const board = lines.slice(0, 9).map((line) =>
      line
        .replace(/[^1-9]/g, " ") // Keep only digits 1-9
        .padEnd(9, " ") // Pad missing characters to maintain row length
        .slice(0, 9) // Trim excess characters
        .split("")
        .map((char) => (/^[1-9]$/.test(char) ? parseInt(char) : ""))
    );

    return board.every((row) => row.length === 9) ? board : null;
  };

  return (
    <div>
      <div className="controls">
        <label>
          Difficulty:
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <button onClick={handleGeneratePuzzle} className="generate-puzzle">
          Generate Puzzle
        </button>
        <button onClick={solveBoard} className="solve-board">
          Solve
        </button>
        <button onClick={revealHint} className="hint-button">
          Hint
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="upload-input"
        />
      </div>
      {ocrLoading && <p>Processing image...</p>}
      {ocrError && <p className="error">{ocrError}</p>}
      {isSolved && (
        <div className="congratulations">
          <h2>Congratulations! 🎉 You solved the puzzle!</h2>
        </div>
      )}
      <div className="sudoku-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cell}
                onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
                hasConflict={false}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SudokuBoard;
