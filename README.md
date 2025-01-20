# a-maze-ing

**A full-stack project showcasing a React frontend, Express.js backend, and Python-based maze algorithms.**  
This repository brings together three main components:
1. A **React** application for the frontend, built with **Vite**.
2. A **Node.js** and **Express.js** server as the backend.
3. **Python** scripts providing various maze generation and solving algorithms.

Below is an overview of the project structure, setup instructions, and basic usage.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Frontend](#running-the-frontend)
- [Running the Backend](#running-the-backend)
- [Python Algorithms](#python-algorithms)
- [Notes](#notes)
- [License](#license)

---



### Key Folders

- **frontend**  
  Contains the React application (created with Vite). 
  - `src/` includes React components, CSS, and main entry points.
  - Run with `npm run dev`.

- **server**  
  A Node.js Express server handling API routes for maze generation, solving, and Q-learning endpoints.
  - `mazeRoutes.js` defines endpoints that interface with Python scripts via `child_process.spawn`.
  - Run with `npm run dev`.

- **python-algos**  
  Python scripts handling maze generation and solving logic (DFS, BFS, Dijkstra, A*, Q-Learning, etc.).
  - Called by the Express server to generate or solve mazes based on user requests.

---

## Prerequisites
1. **Node.js** (v14+ recommended)
2. **Python** (v3.x recommended)
3. Any system dependencies for spawning Python processes from Node (usually none beyond Python itself).

---

## Installation & Setup

1. **Clone** or **download** this repository.
2. Open a terminal in the **root** of the project.

---

## Running the Frontend

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. By default, Vite will indicate a local development URL. Navigate to that URL in your browser to see the React app.

---

## Running the Backend

1. In a separate terminal, navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm run dev
   ```
4. The server will typically run on [http://localhost:3333](http://localhost:3333), providing a set of API endpoints under `/api/maze/`.

---

## Python Algorithms

The **python-algos** folder contains the scripts that actually generate and solve mazes:

- **createMazeAlgorithms.py**  
  Generates a maze using (for example) DFS-based algorithms or random carving methods.

- **solveMazeAlgorithms.py**  
  Uses BFS, DFS, Dijkstra, or A* to solve the maze provided.

- **qLearningAlgorithms.py**  
  Implements Q-Learning on the maze, allowing training episodes to find the best path.

The Express server spawns these scripts using `child_process.spawn` on relevant routes.

---

## Notes
- The React app calls the Express server endpoints, which in turn invoke the Python scripts.
- Make sure Python is accessible on your system path for the server to spawn them (`python3` or `python`).
- Adjust endpoint URLs in the React code if necessary (currently using `http://localhost:3333/api/maze/...` by default).

---

## License
This repository is licensed under an open-source license. Please see the [LICENSE](LICENSE) file (or include your own license text) for details.

---

Feel free to explore the code, modify the scripts, or extend the React UI. Enjoy exploring and solving mazes!

