type SudokuBoardType = (number | "")[][];

const EMPTY_BOARD: SudokuBoardType = Array(9).fill(Array(9).fill(""));

/**
 * Checks if it is safe to place a number in a given cell of the Sudoku board.
 *
 * @param board - The current state of the Sudoku board.
 * @param row - The row index of the cell.
 * @param col - The column index of the cell.
 * @param num - The number to be placed in the cell.
 * @returns `true` if it is safe to place the number, `false` otherwise.
 */
const isSafeToPlaceNumber = (
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

const fillBoard = (board: SudokuBoardType): boolean => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === "") {
                for (let num = 1; num <= 9; num++) {
                    if (isSafeToPlaceNumber(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = "";
                    }
                }
                return false;
            }
        }
    }
    return true;
};

const generateCompletedBoard = (): SudokuBoardType => {
    const board: SudokuBoardType = JSON.parse(JSON.stringify(EMPTY_BOARD));
    fillBoard(board);
    return board;
};

const removeCells = (board: SudokuBoardType, difficulty: "easy" | "medium" | "hard") => {
    let cellsToRemove = difficulty === "easy" ? 35 : difficulty === "medium" ? 45 : 55;
    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== "") {
            board[row][col] = "";
            cellsToRemove--;
        }
    }
};

export const generatePuzzle = (difficulty: "easy" | "medium" | "hard"): SudokuBoardType => {
    const board = generateCompletedBoard();
    removeCells(board, difficulty);
    return board;
};
