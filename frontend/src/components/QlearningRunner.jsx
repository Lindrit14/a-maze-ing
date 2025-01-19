import React, { useState } from "react";
import MazeSolverAnimation from "./MazeSolverAnimation";

export default function QlearningRunner() {
  const [maze, setMaze] = useState([]);
  const [episodesData, setEpisodesData] = useState([]);
  const [bestPath, setBestPath] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [error, setError] = useState(null);
  const [episodeCount, setEpisodeCount] = useState(10);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [mazeSize, setMazeSize] = useState(11); // Default maze size
  const [animateBestPath, setAnimateBestPath] = useState(false); // Toggle for best path animation

  // Fetch Maze from Backend
  const fetchMaze = async () => {
    try {
      const response = await fetch("http://localhost:3333/api/maze/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: mazeSize, start: [1, 1], end: [mazeSize - 2, mazeSize - 2] }),
      });
      if (!response.ok) throw new Error("Failed to fetch maze");
      const data = await response.json();
      setMaze(data.maze);
      setEpisodesData([]);
      setBestPath([]);
      setSelectedEpisode(0);
      setAnimateBestPath(false);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  // Run Q-Learning Algorithm
  const handleQlearn = async () => {
    try {
      if (!maze.length) throw new Error("Please generate a maze first.");
      const response = await fetch("http://localhost:3333/api/maze/qlearn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maze,
          start: [1, 1],
          end: [mazeSize - 2, mazeSize - 2],
          episodes: episodeCount,
        }),
      });
      if (!response.ok) throw new Error("Q-Learning request failed");
      const data = await response.json();
      setEpisodesData(data.episodesData || []);
      setBestPath(data.bestPath || []);
      setSelectedEpisode(0); // Reset to the first episode
      setAnimateBestPath(false);
      setError(null);

      // Log episodes and best path
      console.log("Episodes Data:", data.episodesData);
      console.log("Best Path:", data.bestPath);
    } catch (e) {
      setError(e.message);
    }
  };

  // Handle Episode Selection
  const handleEpisodeSelect = (e) => {
    setSelectedEpisode(Number(e.target.value));
    setAnimateBestPath(false); // Disable best path animation
  };

  // Handle Best Path Animation
  const handleBestPathAnimation = () => {
    setAnimateBestPath(true);
  };

  // Visited States for Selected Episode
  const chosenEpisodeVisited = !animateBestPath
    ? episodesData[selectedEpisode]?.visitedStates || []
    : []; // Empty visited when animating the best path

  return (
    <div>
      <h2>Q-Learning Maze</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Maze Size Selector */}
      <div>
        <label htmlFor="maze-size">Maze Size: </label>
        <input
          type="number"
          id="maze-size"
          value={mazeSize}
          min={5}
          max={51} // Limit the size to prevent crashes for large mazes
          onChange={(e) => setMazeSize(Number(e.target.value))}
        />
      </div>

      {/* Buttons */}
      <div>
        <button onClick={fetchMaze}>Generate Maze</button>
        <button onClick={handleQlearn} disabled={!maze.length}>
          Run Q-Learning
        </button>
      </div>

      {/* Episode Count */}
      <div>
        <label>Episodes to train:</label>
        <input
          type="number"
          value={episodeCount}
          min={1}
          max={1000} // Limit episodes to prevent performance issues
          onChange={(e) => setEpisodeCount(Number(e.target.value))}
        />
      </div>

      {/* Episode Selector */}
      {episodesData.length > 0 && (
        <div>
          <label>Pick Episode:</label>
          <select value={selectedEpisode} onChange={handleEpisodeSelect}>
            {episodesData.map((ep, idx) => (
              <option key={idx} value={idx}>
                Episode #{idx} (Reward: {ep.totalReward})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Best Path Button */}
      {bestPath.length > 0 && (
        <button onClick={handleBestPathAnimation}>Show Best Path</button>
      )}

      {/* MazeSolverAnimation */}
      {maze.length > 0 && (
        <MazeSolverAnimation
          key={animateBestPath ? "best-path" : `episode-${selectedEpisode}`} // Reset animation when toggling
          maze={maze}
          visited={chosenEpisodeVisited}
          solution={animateBestPath ? bestPath : []} // Show best path if toggled
          start={[1, 1]}
          end={[mazeSize - 2, mazeSize - 2]}
          speed={animationSpeed}
        />
      )}
    </div>
  );
}
