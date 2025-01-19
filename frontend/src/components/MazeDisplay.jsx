import React from "react";

// eslint-disable-next-line react/prop-types
export default function MazeDisplay({ maze, start, end, solution, visited }) {
  return (
    <div className="maze-grid">
      {maze.map((row, r) => (
        <div key={r} className="maze-row">
          {row.map((cell, c) => {
            let cellClass = "maze-cell";

            if (cell === 1) cellClass += " wall";
            if (r === start[0] && c === start[1]) cellClass += " start";
            if (r === end[0] && c === end[1]) cellClass += " end";
            if (visited.some(([vr, vc]) => vr === r && vc === c))
              cellClass += " visited"; // Highlight incrementally
            if (solution.some(([sr, sc]) => sr === r && sc === c))
              cellClass += " solution"; // Highlight solution path

            return <div key={c} className={cellClass}></div>;
          })}
        </div>
      ))}
    </div>
  );
}






