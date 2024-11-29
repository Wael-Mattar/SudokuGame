import React from 'react';

interface SudokuCellProps {
    value: number | "";
    onChange: (newValue: number | "") => void;
    hasConflict: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ value, onChange, hasConflict }) => {
    /**
     * Handles the change event for the Sudoku cell input.
     * 
     * This function ensures that the input value is either a digit between 1 and 9 or an empty string.
     * If the input value is valid, it calls the `onChange` callback with the new value.
     * 
     * @param e - The change event triggered by the input element.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^[1-9]$/.test(newValue) || newValue === "") {
            onChange(newValue === "" ? "" : parseInt(newValue));
        }
    };

    return (
        <input
            type="text"
            className={`sudoku-cell ${hasConflict ? 'conflict' : ''}`}
            value={value === "" ? "" : value.toString()}
            onChange={handleInputChange}
            maxLength={1}
        />
    );
};

export default SudokuCell;
