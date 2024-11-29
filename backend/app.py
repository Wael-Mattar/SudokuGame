from flask import Flask, request, jsonify, send_file
import os
from image_processing import preprocess_image, find_sudoku_board, extract_digits, solve_and_overlay_solution
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/solve-sudoku', methods=['POST'])
def solve_sudoku():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Preprocess and solve the image here
    thresh = preprocess_image(file_path)
    board_img = find_sudoku_board(thresh)
    if board_img is None:
        return jsonify({'error': 'Could not find Sudoku board'}), 400

    digits = extract_digits(board_img)
    if not digits or len(digits) != 9 or len(digits[0]) != 9:
        return jsonify({'error': 'Invalid Sudoku board detected'}), 400
    
    original_img = solve_and_overlay_solution(cv2.imread(file_path), board_img, digits)
    
    output_path = os.path.join(UPLOAD_FOLDER, 'solved_' + file.filename)
    cv2.imwrite(output_path, original_img)
    
    return send_file(output_path, mimetype='image/jpeg')  # Send solved image back

if __name__ == '__main__':
    app.run(debug=True)
