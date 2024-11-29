import cv2
import numpy as np
from sudoku_solver import backtracking_sudoku_solver
import pytesseract
from typing import List


pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_image(image_path: str) -> np.ndarray:
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    blurred = cv2.GaussianBlur(image, (7, 7), 3)
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY_INV, 11, 2)
    return thresh

def find_sudoku_board(thresh: np.ndarray) -> np.ndarray:
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_contour = max(contours, key=cv2.contourArea)
    approx = cv2.approxPolyDP(largest_contour, 0.02 * cv2.arcLength(largest_contour, True), True)

    if len(approx) == 4:
        pts = approx.reshape(4, 2)
        board_pts = reorder_points(pts)
        side = max(np.linalg.norm(board_pts[0] - board_pts[1]), np.linalg.norm(board_pts[1] - board_pts[2]))
        dest = np.array([[0, 0], [side - 1, 0], [side - 1, side - 1], [0, side - 1]], dtype="float32")
        M = cv2.getPerspectiveTransform(board_pts, dest)
        return cv2.warpPerspective(thresh, M, (int(side), int(side)))
    return None

def reorder_points(pts: np.ndarray) -> np.ndarray:
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect

def extract_digits(board_img: np.ndarray) -> List[List[int]]:
    side = board_img.shape[0] // 9
    digits = []

    for i in range(9):
        row = []
        for j in range(9):
            cell = board_img[i * side:(i + 1) * side, j * side:(j + 1) * side]
            cell_thresh = cv2.threshold(cell, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
            contours, _ = cv2.findContours(cell_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            if contours:
                largest_contour = max(contours, key=cv2.contourArea)
                x, y, w, h = cv2.boundingRect(largest_contour)
                if w * h > 50:  # Ignore too small contours
                    roi = cell[y:y + h, x:x + w]
                    digit = recognize_digit(roi)
                    row.append(digit)
                else:
                    row.append(0)
            else:
                row.append(0)
        digits.append(row)
    return digits

def recognize_digit(roi: np.ndarray) -> int:
    # Resize ROI and preprocess for Tesseract
    roi = cv2.resize(roi, (28, 28))
    roi = cv2.GaussianBlur(roi, (3, 3), 0)
    roi = cv2.threshold(roi, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    
    config = r'--oem 3 --psm 10 -c tessedit_char_whitelist=123456789'
    text = pytesseract.image_to_string(roi, config=config).strip()
    return int(text) if text.isdigit() else 0

def solve_and_overlay_solution(original_img: np.ndarray, board_img: np.ndarray, digits: List[List[int]]) -> np.ndarray:
    solved_board = [row[:] for row in digits]
    if backtracking_sudoku_solver(solved_board):
        side = board_img.shape[0] // 9
        for i in range(9):
            for j in range(9):
                if digits[i][j] == 0:  # Only overwrite empty cells
                    cv2.putText(original_img, str(solved_board[i][j]),
                                (j * side + side // 4, (i + 1) * side - side // 4),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    return original_img
