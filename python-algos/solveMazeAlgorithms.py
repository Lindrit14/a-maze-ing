import heapq
import json
from collections import deque

def solve_maze(maze, start, end, algorithm="DFS"):
    """
    Solves a maze using the specified algorithm: DFS, BFS, Dijkstra, or A*.
    Args:
        maze (list): 2D grid representing the maze (0 = path, 1 = wall).
        start (tuple): Starting position (row, col).
        end (tuple): Ending position (row, col).
        algorithm (str): Algorithm to use ('DFS', 'BFS', 'Dijkstra', or 'A-Star').
    Returns:
        dict: Contains 'solution' (list of coordinates of the solution path)
              and 'visited' (list of all visited nodes).
    """
    rows, cols = len(maze), len(maze[0])
    visited = set()
    visitedSequence = []
    path = []

    def in_bounds(r, c):
        return 0 <= r < rows and 0 <= c < cols

    def dfs(r, c):
        if (r, c) == end:
            path.append((r, c))
            visitedSequence.append((r, c))
            return True

        if not in_bounds(r, c) or maze[r][c] == 1 or (r, c) in visited:
            return False

        visited.add((r, c))
        visitedSequence.append((r, c))
        path.append((r, c))

        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            if dfs(r + dr, c + dc):
                return True

        path.pop()  # Backtrack
        return False

    def bfs():
        queue = deque([start])  # Queue for BFS
        prev = {}  # To reconstruct the path
        
        visited.add(start)
        visitedSequence.append(start)

        while queue:
            current = queue.popleft()

            if current == end:
                break

            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                neighbor = (current[0] + dr, current[1] + dc)
                if (
                    in_bounds(neighbor[0], neighbor[1])
                    and maze[neighbor[0]][neighbor[1]] == 0
                    and neighbor not in visited
                ):
                    visited.add(neighbor)
                    visitedSequence.append(neighbor) 
                    prev[neighbor] = current
                    queue.append(neighbor)

        # Reconstruct the path
        if end in prev:
            current = end
            while current:
                path.insert(0, current)
                current = prev.get(current)

    def dijkstra():
        pq = [(0, start)]  # Priority queue of (cost, position)
        costs = {start: 0}
        prev = {}

        while pq:
            cost, current = heapq.heappop(pq)
            if current in visited:
                continue
            visited.add(current)
            visitedSequence.append(current)

            if current == end:
                break

            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                neighbor = (current[0] + dr, current[1] + dc)
                if in_bounds(neighbor[0], neighbor[1]) and maze[neighbor[0]][neighbor[1]] == 0:
                    new_cost = cost + 1
                    if neighbor not in costs or new_cost < costs[neighbor]:
                        costs[neighbor] = new_cost
                        prev[neighbor] = current
                        heapq.heappush(pq, (new_cost, neighbor))

        # Reconstruct the path
        if end in prev:
            current = end
            while current:
                path.insert(0, current)
                current = prev.get(current)

    def a_star():
        def heuristic(node):
            # Manhattan distance
            return abs(node[0] - end[0]) + abs(node[1] - end[1])

        pq = [(heuristic(start), 0, start)]  # (f_score, g_score, node)
        g_scores = {start: 0}
        prev = {}

        while pq:
            _, g_score, current = heapq.heappop(pq)
            if current in visited:
                continue
            visited.add(current)
            visitedSequence.append(current)

            if current == end:
                break

            for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                neighbor = (current[0] + dr, current[1] + dc)
                if in_bounds(neighbor[0], neighbor[1]) and maze[neighbor[0]][neighbor[1]] == 0:
                    new_g_score = g_score + 1
                    if neighbor not in g_scores or new_g_score < g_scores[neighbor]:
                        g_scores[neighbor] = new_g_score
                        prev[neighbor] = current
                        f_score = new_g_score + heuristic(neighbor)
                        heapq.heappush(pq, (f_score, new_g_score, neighbor))

        # Reconstruct the path
        if end in prev:
            current = end
            while current:
                path.insert(0, current)
                current = prev.get(current)

    if algorithm == "DFS":
        dfs(start[0], start[1])
    elif algorithm == "BFS":
        bfs()
    elif algorithm == "Dijkstra":
        dijkstra()
    elif algorithm == "A-Star":
        a_star()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

    return {"solution": path or [], "visitedSequence": visitedSequence or []}

if __name__ == "__main__":
    # Example usage
    import sys

    maze_input = sys.stdin.read()
    maze_data = json.loads(maze_input)

    maze = maze_data["maze"]
    start = tuple(maze_data["start"])
    end = tuple(maze_data["end"])
    algorithm = maze_data.get("algorithm", "DFS")  # Default to DFS

    result = solve_maze(maze, start, end, algorithm)
    print(json.dumps(result))
