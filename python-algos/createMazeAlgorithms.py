#!/usr/bin/env python3
import json
import random

def generate_maze(size, start, end):
    """Generate a maze of specified size."""
    WIDTH = HEIGHT = size

    # Fill the grid with walls (1)
    maze = [[1 for _ in range(WIDTH)] for _ in range(HEIGHT)]
    visited = set()

    def in_bounds(r, c):    
        return 0 <= r < HEIGHT and 0 <= c < WIDTH

    def visit(r, c):
        """Carves out passages in steps of two, leaving walls in-between."""
        visited.add((r, c))
        maze[r][c] = 0  # Carve out current cell

        # List of directions we can move in increments of 2
        directions = [(-2, 0), (2, 0), (0, -2), (0, 2)]
        random.shuffle(directions)

        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc) and (nr, nc) not in visited:
                # Carve the wall between (r, c) and (nr, nc):
                wall_r = r + (dr // 2)
                wall_c = c + (dc // 2)
                maze[wall_r][wall_c] = 0

                # Recursively carve the next cell
                visit(nr, nc)

    # Initialize the maze and carve paths
    visited.clear()
    visit(start[0], start[1])

    # Ensure the start and end points are paths
    maze[start[0]][start[1]] = 0
    maze[end[0]][end[1]] = 0

    return maze

if __name__ == "__main__":
    import sys
    input_data = json.loads(sys.stdin.read())
    size = input_data["size"]
    start = tuple(input_data["start"])
    end = tuple(input_data["end"])
    maze = generate_maze(size, start, end)
    print(json.dumps(maze))
