// Générateur de grilles de sudoku avec différents niveaux de difficulté
// Facile, Moyen, Difficile

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SudokuGrid = number[][];

function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isSafe(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num || grid[x][col] === num) return false;
  }
  const startRow = row - row % 3;
  const startCol = col - col % 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

function fillGrid(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        const numbers = shuffle([1,2,3,4,5,6,7,8,9]);
        for (const num of numbers) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (fillGrid(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function removeCells(grid: SudokuGrid, difficulty: Difficulty): SudokuGrid {
  const gridCopy = grid.map(row => [...row]);
  let cellsToRemove;
  switch (difficulty) {
    case 'easy': cellsToRemove = 36; break;
    case 'medium': cellsToRemove = 46; break;
    case 'hard': cellsToRemove = 54; break;
    default: cellsToRemove = 36;
  }
  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (gridCopy[row][col] !== 0) {
      gridCopy[row][col] = 0;
      cellsToRemove--;
    }
  }
  return gridCopy;
}


export function generateSudoku(difficulty: Difficulty = 'easy'): SudokuGrid {
  const grid: SudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillGrid(grid);
  return removeCells(grid, difficulty);
}

// Résolution d'une grille de sudoku
export function solveSudoku(grid: SudokuGrid): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) return true;
            grid[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}
