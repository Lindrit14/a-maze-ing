const express = require("express");
const { spawn } = require("child_process");
const router = express.Router();

// POST /api/maze/generate
router.post("/generate", (req, res) => {
  const { start, end, size } = req.body;

  const pythonProcess = spawn("python3", [
    "/Users/lindritprekaj/projects/a-maze-ing/python-algos/createMazeAlgorithms.py",
  ]);

  let mazeOutput = "";
  let errorOutput = "";

  pythonProcess.stdin.write(
    JSON.stringify({ start, end, size })
  );
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    mazeOutput += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}: ${errorOutput}`);
      return res
        .status(500)
        .json({ error: `Python script failed with error: ${errorOutput}` });
    }

    try {
      const maze = JSON.parse(mazeOutput);

      // Ensure start and end points are paths in the maze
      maze[start[0]][start[1]] = 0;
      maze[end[0]][end[1]] = 0;

      res.json({ maze });
    } catch (err) {
      console.error("Failed to parse maze output:", err);
      res.status(500).json({ error: "Failed to parse maze output" });
    }
  });
});

// POST /api/maze/solve
router.post("/solve", (req, res) => {
  const { maze, start, end, algorithm } = req.body;

  const pythonProcess = spawn("python3", [
    "/Users/lindritprekaj/projects/a-maze-ing/python-algos/solveMazeAlgorithms.py",
  ]);

  let solutionOutput = "";
  let errorOutput = "";

  pythonProcess.stdin.write(
    JSON.stringify({ maze, start, end, algorithm })
  );
  pythonProcess.stdin.end();

  pythonProcess.stdout.on("data", (data) => {
    solutionOutput += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}: ${errorOutput}`);
      return res.status(500).json({ error: `Python script failed with error: ${errorOutput}` });
    }

    try {
      const solution = JSON.parse(solutionOutput);
      res.json(solution);
    } catch (err) {
      console.error("Failed to parse solution output:", err);
      res.status(500).json({ error: "Failed to parse solution output" });
    }
  });
});


module.exports = router;
