# Sudoku Solver Game

This is a Sudoku game with an interactive board where users can:
- Generate Sudoku puzzles of varying difficulty (Easy, Medium, Hard).
- Solve the puzzles manually or by using the "Solve" button.
- Get hints for specific cells.

## Features

- **Interactive Sudoku Board**: A dynamic board where you can input values into cells.
- **Generate Puzzle**: A new puzzle can be generated with varying levels of difficulty.
- **Solve Puzzle**: You can solve the puzzle automatically by clicking the "Solve" button.
- **Hint**: Get a hint for solving the puzzle.

## Work In Progress: Image Upload and OCR Solution

One of the key features I am working on is the ability to upload a Sudoku image, extract the board data using Optical Character Recognition (OCR), and solve the board dynamically. Currently, this feature is **not yet working**. However, I am in the process of building a **Python API** to solve this, which is not yet finished.

### Approach Used

To implement this, I have integrated the following:
- **Optical Character Recognition (OCR)**: Using tools like `Tesseract` to process the uploaded Sudoku image and extract the digits.
- **Image Preprocessing**: Using `OpenCV` for image preprocessing to improve OCR accuracy.

You can see the current approach in the code, but due to various challenges with OCR accuracy and image processing, it has not been fully implemented yet.

### Future Work

- Complete the OCR and image preprocessing pipeline.
- Finish the Python API for solving Sudoku from an image.
- Improve the accuracy of OCR to handle various fonts and image qualities.

## Getting Started

To run the game locally:

1. Clone this repository:
2. npm install
3. npm start

