"use client";
import { useState } from "react";
import { generateSudoku, solveSudoku, Difficulty, SudokuGrid } from "./sudokuGenerator";

function cloneGrid(grid: SudokuGrid): SudokuGrid {
  return grid.map(row => [...row]);
}

function getInvalidCells(grid: SudokuGrid): boolean[][] {
  const invalid: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(false));
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col];
      if (val === 0) continue;
      for (let k = 0; k < 9; k++) {
        if (k !== col && grid[row][k] === val) invalid[row][col] = true;
        if (k !== row && grid[k][col] === val) invalid[row][col] = true;
      }
      const startRow = row - row % 3;
      const startCol = col - col % 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const r = startRow + i;
          const c = startCol + j;
          if ((r !== row || c !== col) && grid[r][c] === val) invalid[row][col] = true;
        }
      }
    }
  }
  return invalid;
}

function SudokuBoard({ grid, onChange, editable, invalidCells, fixedCells }: { grid: SudokuGrid; onChange?: (row: number, col: number, value: number) => void; editable?: boolean; invalidCells?: boolean[][]; fixedCells?: boolean[][] }) {
  return (
    <table className="border border-gray-400 mx-auto" style={{background:'#fff',borderRadius:16,boxShadow:'0 2px 16px #e0e0e0'}}>
      <tbody>
        {grid.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{width:40,height:40,border:'1px solid #bdbdbd',textAlign:'center',background:'#fafafa',fontSize:20,fontWeight:'bold',color:'#222',borderRight:(j%3===2&&j!==8)?'2px solid #222':'',borderBottom:(i%3===2&&i!==8)?'2px solid #222':''}}>
                {editable && onChange ? (
                  fixedCells && fixedCells[i][j] ? (
                    <span style={{color:'#222',fontWeight:'bold',userSelect:'none'}}>{cell}</span>
                  ) : (
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={cell === 0 ? "" : cell}
                      onChange={e => onChange(i, j, Number(e.target.value))}
                      style={{width:'100%',height:'100%',textAlign:'center',background:'#fff',border:'none',outline:'none',fontSize:20,fontWeight:'bold',color:invalidCells && invalidCells[i][j] ? '#d32f2f' : '#222'}}
                    />
                  )
                ) : (
                  cell !== 0 ? (
                    <span style={{color:invalidCells && invalidCells[i][j] ? '#d32f2f' : '#222',fontWeight:'bold'}}>{cell}</span>
                  ) : ""
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Home() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<SudokuGrid | null>(null);
  const [solvedGrid, setSolvedGrid] = useState<SudokuGrid | null>(null);
  const [error, setError] = useState<string>("");
  const [customGrid, setCustomGrid] = useState<SudokuGrid>(Array.from({ length: 9 }, () => Array(9).fill(0)));
  const [showCustom, setShowCustom] = useState(false);
  const [userGrid, setUserGrid] = useState<SudokuGrid | null>(null);
  const [checkResult, setCheckResult] = useState<string>("");

  const handleGenerate = () => {
    const generated = generateSudoku(difficulty);
    setGrid(generated);
    setUserGrid(cloneGrid(generated));
    setSolvedGrid(null);
    setError("");
    setShowCustom(false);
    setCheckResult("");
  };

  const handleUserChange = (row: number, col: number, value: number) => {
    if (!userGrid) return;
    if (value < 0 || value > 9) return;
    setUserGrid(prev => {
      if (!prev) return null;
      const copy = cloneGrid(prev);
      copy[row][col] = value;
      return copy;
    });
  };

  const handleCheck = () => {
    if (!userGrid || !grid) return;
    const invalid = getInvalidCells(userGrid);
    const hasInvalid = invalid.flat().some(Boolean);
    if (hasInvalid) {
      setCheckResult("Erreur : La grille contient des chiffres en conflit (ligne, colonne ou bloc). Les chiffres invalides sont en rouge.");
      return;
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (userGrid[i][j] === 0) {
          setCheckResult("La grille n'est pas entièrement remplie.");
          return;
        }
      }
    }
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] !== 0 && userGrid[i][j] !== grid[i][j]) {
          setCheckResult("Erreur : Vous avez modifié une case pré-remplie.");
          return;
        }
      }
    }
    setCheckResult("Bravo ! La solution est correcte.");
  };

  const handleSolve = () => {
    if (!grid) return;
    const gridCopy = cloneGrid(grid);
    const solved = solveSudoku(gridCopy);
    if (solved) {
      setSolvedGrid(gridCopy);
      setError("");
    } else {
      setError("Grille non résoluble.");
    }
  };

  const handleCustomSolve = () => {
    const invalid = getInvalidCells(customGrid);
    const hasInvalid = invalid.flat().some(Boolean);
    if (hasInvalid) {
      setSolvedGrid(null);
      setError("Erreur : La grille contient des chiffres en conflit (ligne, colonne ou bloc). Les chiffres invalides sont en rouge.");
      return;
    }
    const gridCopy = cloneGrid(customGrid);
    const solved = solveSudoku(gridCopy);
    if (solved) {
      setSolvedGrid(gridCopy);
      setError("");
    } else {
      setSolvedGrid(null);
      setError("Grille non résoluble.");
    }
  };

  const handleCustomChange = (row: number, col: number, value: number) => {
    if (value < 0 || value > 9) return;
    setCustomGrid(prev => {
      const copy = cloneGrid(prev);
      copy[row][col] = value;
      return copy;
    });
  };

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f5',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'flex-start',fontFamily:'Inter, Arial, sans-serif',padding:'32px 0'}}>
      <div style={{width:'100%',maxWidth:480,background:'#fff',borderRadius:24,boxShadow:'0 2px 24px #e0e0e0',padding:'32px 24px',margin:'24px 0'}}>
        <h1 style={{fontSize:32,fontWeight:800,marginBottom:24,color:'#222',textAlign:'center',letterSpacing:'-1px'}}>Sudoku</h1>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center',alignItems:'center',marginBottom:24}}>
          <label style={{fontWeight:600,color:'#222'}}>Niveau :</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)} style={{padding:'6px 12px',borderRadius:8,border:'1px solid #bdbdbd',fontWeight:500,color:'#222',background:'#fafafa'}}>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
          <button onClick={handleGenerate} style={{padding:'8px 18px',background:'#1976d2',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',boxShadow:'0 1px 4px #e0e0e0'}}>Générer</button>
          <button onClick={handleSolve} style={{padding:'8px 18px',background:'#388e3c',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',boxShadow:'0 1px 4px #e0e0e0'}} disabled={!grid}>Résoudre</button>
          <button onClick={() => {setShowCustom(true); setGrid(null); setSolvedGrid(null); setError("");}} style={{padding:'8px 18px',background:'#fbc02d',color:'#222',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',boxShadow:'0 1px 4px #e0e0e0'}}>Entrer une grille</button>
        </div>
        {grid && userGrid && (
          <div style={{marginBottom:32,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:12,color:'#222'}}>Remplissez la grille</h2>
            <SudokuBoard
              grid={userGrid}
              onChange={handleUserChange}
              editable={true}
              invalidCells={getInvalidCells(userGrid)}
              fixedCells={grid.map(row => row.map(cell => cell !== 0))}
            />
            <button onClick={handleCheck} style={{marginTop:16,padding:'8px 18px',background:'#7b1fa2',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',boxShadow:'0 1px 4px #e0e0e0'}}>Vérifier</button>
            {checkResult && <div style={{marginTop:10,color:checkResult.startsWith('Bravo') ? '#388e3c' : '#d32f2f',fontWeight:600}}>{checkResult}</div>}
          </div>
        )}
        {showCustom && (
          <div style={{marginBottom:32,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:12,color:'#222'}}>Saisissez votre grille</h2>
            <SudokuBoard grid={customGrid} onChange={handleCustomChange} editable={true} invalidCells={getInvalidCells(customGrid)} />
            <button onClick={handleCustomSolve} style={{marginTop:16,padding:'8px 18px',background:'#388e3c',color:'#fff',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',boxShadow:'0 1px 4px #e0e0e0'}}>Résoudre ma grille</button>
          </div>
        )}
        {solvedGrid && (
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:20,fontWeight:700,marginBottom:12,color:'#222'}}>Solution</h2>
            <SudokuBoard grid={solvedGrid} />
          </div>
        )}
        {error && <div style={{color:'#d32f2f',marginTop:16,fontWeight:600}}>{error}</div>}
      </div>
      <footer style={{marginTop:24,color:'#222',fontWeight:500,fontSize:14,opacity:0.7}}>© 2026 Sudoku App.</footer>
    </div>
  );
}
