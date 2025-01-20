import React, { useState, useEffect, useRef } from "react";

export default function MazeSolverAnimation({
  // eslint-disable-next-line react/prop-types
  maze = [],
  visited = [],
  solution = [],
  start = [0, 0],
  end = [0, 0],
  speed = 1100,
  runtime = 0, // Passed from App
  totalVisitedSteps = 0, // Passed from App
  solutionSteps = 0, // Passed from App
}) {
  const [animationIndex, setAnimationIndex] = useState(0); // For visited animation
  const [solutionIndex, setSolutionIndex] = useState(0); // For solution animation
  const [animatingVisited, setAnimatingVisited] = useState(true); // Animating visited or solution
  const [animating, setAnimating] = useState(false); // Toggle animation state
  const [paused, setPaused] = useState(false); // Track pause/resume state
  const [finished, setFinished] = useState(false); // Track if animation is done

  const intervalRef = useRef(null);

  // Start Animation
  const handleStartAnimation = () => {
    setAnimating(true);
    setPaused(false);
    setAnimationIndex(0);
    setSolutionIndex(0);
    setAnimatingVisited(true);
    setFinished(false);
  };

   // Pause/Resume Animation
   const handlePauseResume = () => {
    setPaused((prev) => !prev);
  };

  // Animation Logic
  useEffect(() => {
    if (!animating || paused) {
        clearInterval(intervalRef.current); // Stop interval if paused or not animating
        return;
      }

    intervalRef.current = setInterval(() => {
      if (animatingVisited) {
        // Animate visited nodes
        setAnimationIndex((prev) => {
          const next = prev + 1;
          if (next >= visited.length) {
            setAnimatingVisited(false); // Transition to solution animation
            return visited.length; // Cap to visited length
          }
          return next;
        });
      } else {
        // Animate solution nodes
        setSolutionIndex((prev) => {
          const next = prev + 1;
          if (next >= solution.length) {
            clearInterval(intervalRef.current); // Stop animation
            setAnimating(false); // Stop animating
            setFinished(true);
          }
          return next;
        });
      }
    }, speed);

    return () => clearInterval(intervalRef.current); // Cleanup interval
  }, [animating, paused, animatingVisited, speed, visited.length, solution.length]);

  // Subsets for animation
  const visitedSoFar = visited.slice(0, animationIndex);
  const solutionSoFar = solution.slice(0, solutionIndex);

  

  return (
    <div>
      <button onClick={handleStartAnimation}>Start Animation</button>
      <button onClick={handlePauseResume}>
        {paused ? "Resume Animation" : "Pause Animation"}
      </button>
      <div style={{ marginTop: "1rem" }}>
        <MazeGrid
          maze={maze}
          start={start}
          end={end}
          visited={visitedSoFar}
          solution={solutionSoFar.reverse()}
        />
      </div>
      {finished && (
        <div className="metrics">
          <h3>Metrics:</h3>
          <p>Runtime: {runtime.toFixed(10)} seconds</p>
          <p>Total Visited Steps: {totalVisitedSteps}</p>
          <p>Solution Steps: {solutionSteps}</p>
        </div>
      )}

    </div>
  );
}

function MazeGrid({ maze, start, end, visited, solution }) {
  return (
    <div className="maze-grid">
      {maze.map((row, rIndex) => (
        <div key={rIndex} className="maze-row">
          {row.map((cell, cIndex) => {
            let className = "maze-cell";

            if (cell === 1) className += " wall";
            if (rIndex === start[0] && cIndex === start[1]) {
              className += " start";
            }
            if (rIndex === end[0] && cIndex === end[1]) {
              className += " end";
            }
            if (
              visited.some(([vr, vc], idx) => {
                const next = visited[idx + 1];
                return vr === rIndex && vc === cIndex && next && maze[next[0]][next[1]] === 1;
              })
            ) {
              className += " wall-hit"; // Highlight wall hit
            } else if (visited.some(([vr, vc]) => vr === rIndex && vc === cIndex)) {
              className += " visited"; // Highlight visited
            }
            if (solution.some(([sr, sc]) => sr === rIndex && sc === cIndex)) {
              className += " solution"; // Highlight solution path
            }

            return <div key={cIndex} className={className} />;
          })}
        </div>
      ))}
    </div>
  );
}