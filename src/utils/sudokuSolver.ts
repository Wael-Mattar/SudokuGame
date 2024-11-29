// src/utils/sudokuSolver.ts
type SudokuBoardType = (number | "")[][];

const findEmptyCell = (board: SudokuBoardType): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === "") return [row, col];
    }
  }
  return null;
};

const isValidPlacement = (
  board: SudokuBoardType,
  row: number,
  col: number,
  num: number
): boolean => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    if (board[startRow + Math.floor(x / 3)][startCol + (x % 3)] === num) return false;
  }
  return true;
};

export const validateBoard = (board: SudokuBoardType): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== "") {
        board[row][col] = ""; // Temporarily remove the number to check validity
        if (!isValidPlacement(board, row, col, num)) {
          board[row][col] = num; // Restore the number after check
          return false; // Invalid placement found
        }
        board[row][col] = num; // Restore the number after check
      }
    }
  }
  return true;
};

export const solveSudoku = (board: SudokuBoardType): boolean => {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = "";
        }
    }
    return false;
};

export const getHint = (board: SudokuBoardType): SudokuBoardType | null => {
    const boardCopy = JSON.parse(JSON.stringify(board));
    if (solveSudoku(boardCopy)) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === "") {
                    board[row][col] = boardCopy[row][col];
                    return board;
                }
            }
        }
    }
    return null;
};
