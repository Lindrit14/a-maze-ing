import React, { useEffect, useState } from "react";
import "./App.css";
import MazeDisplay from "./components/MazeDisplay";



function App() {
  const [maze, setMaze] = useState([]);
  const [solution, setSolution] = useState([]);
  const [error, setError] = useState(null);
  const [visited, setVisited] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("DFS");
  const [startNode, setStartNode] = useState([1, 1]); // Default start node
  const [endNode, setEndNode] = useState([19, 19]); // Default end node
  const [mazeSize, setMazeSize] = useState(21); // Default maze size
  const [animationIndex, setAnimationIndex] = useState(0); // For animation step
  const [paused, setPaused] = useState(true); // Control pause/resume
  const [animationSpeed, setAnimationSpeed] = useState(500); // Speed in ms

useEffect(() => {
  if (paused || !visited.length) return;

  const timer = setInterval(() => {
    setAnimationIndex((prev) => {
      if (prev >= visited.length) {
        clearInterval(timer);
        return prev;
      }
      return prev + 1;
    });
  }, animationSpeed);

  return () => clearInterval(timer); // Clean up
}, [paused, visited, animationSpeed]);

  const fetchMaze = async () => {
    try {
      const response = await fetch("http://localhost:3333/api/maze/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start: startNode, end: endNode, size: mazeSize }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch maze");
      }
      const data = await response.json();
      setMaze(data.maze);
      setSolution([]);
      setVisited([]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const solveMaze = async () => {
    try {
      const response = await fetch("http://localhost:3333/api/maze/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maze,
          algorithm: selectedAlgorithm,
          start: startNode,
          end: endNode
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to solve maze");
      }
  
      const data = await response.json();
      // Ensure arrays exist (avoid 'undefined' errors)
      setSolution(data.solution || []);
      setVisited(data.visited || []);
  
      // Log them directly
      console.log("Solution path:", data.solution);
      console.log("Visited path:", data.visited);
  
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setVisited([])
    setSolution([]); // Clear any previous solution
  };

  const handleNodeChange = (type, value) => {
    const parsedValue = value.split(",").map((v) => parseInt(v.trim(), 10));
    if (type === "start") setStartNode(parsedValue);
    if (type === "end") setEndNode(parsedValue);
  };

  const handleSizeChange = (size) => {
    const parsedSize = parseInt(size, 10);
    setMazeSize(parsedSize);
    setStartNode([1, 1]); // Reset start node
    setEndNode([parsedSize - 2, parsedSize - 2]); // Reset end node
  };

  return (
    <div>
      <button onClick={fetchMaze}>Generate Maze</button>

      <div className="dropdown">
        <label htmlFor="algorithm-select">Select Algorithm: </label>
        <select
          id="algorithm-select"
          value={selectedAlgorithm}
          onChange={(e) => handleAlgorithmSelect(e.target.value)}
        >
          <option value="DFS">DFS</option>
          <option value="BFS">BFS</option>
          <option value="Dijkstra">Dijkstra</option>
          <option value="A-Star">A-Star</option>
        </select>
        <button onClick={solveMaze} disabled={maze.length === 0}>
          Solve Maze
        </button>
      </div>

      <div>
        <label htmlFor="maze-size-select">Maze Size: </label>
        <select
          id="maze-size-select"
          value={mazeSize}
          onChange={(e) => handleSizeChange(e.target.value)}
        >
          <option value={21}>20 x 20</option>
          <option value={31}>30 x 30</option>
          <option value={41}>40 x 40</option>
          <option value={51}>50 x 50</option>
          <option value={61}>60 x 60</option>
          <option value={71}>70 x 70</option>
          <option value={81}>80 x 80</option>
        </select>
      </div>

      <div>
        <label>
          Start Node (row,col):{" "}
          <input
            type="text"
            value={startNode.join(",")}
            onChange={(e) => handleNodeChange("start", e.target.value)}
          />
        </label>
        <label>
          End Node (row,col):{" "}
          <input
            type="text"
            value={endNode.join(",")}
            onChange={(e) => handleNodeChange("end", e.target.value)}
          />
        </label>
      </div>

      <div>
  <label>
    Speed:
    <select
      value={animationSpeed}
      onChange={(e) => setAnimationSpeed(parseInt(e.target.value, 10))}
    >
      <option value={1000}>Slow</option>
      <option value={500}>Medium</option>
      <option value={100}>Fast</option>
    </select>
  </label>
  <button onClick={() => setPaused(!paused)}>
    {paused ? "Resume" : "Pause"}
  </button>
</div>


      {error && <p style={{ color: "red" }}>{error}</p>}
      {maze.length > 0 && (
        <MazeDisplay
        maze={maze}
        start={startNode}
        end={endNode}
        solution={solution}
        visited={visited.slice(0, animationIndex)} // Only show up to current animationIndex
      />
      )}
      {maze.length === 0 && !error && <p>Click "Generate Maze" to create a new maze!</p>}
    </div>
  );
}

export default App;
