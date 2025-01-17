// server/mazeRoutes.js (z.B.)
const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();

router.post('/solve', (req, res) => {
  const { algorithm, width, height } = req.body;
  
  // Python-Skript aufrufen, z.B.:
  const pyProcess = spawn('python', [
    '../python-algos/maze_algorithms.py',
    algorithm,
    width,
    height
  ]);

  let resultData = '';
  pyProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pyProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data}`);
  });

  pyProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Python script error' });
    }
    // resultData ist ein JSON-String, also parsen
    try {
      const jsonData = JSON.parse(resultData);
      res.json(jsonData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse Python output' });
    }
  });
});

module.exports = router;
