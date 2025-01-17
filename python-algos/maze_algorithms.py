# maze_algorithms.py
import time
import sys

def bfs(maze):
    # Beispielhafter Platzhalter-Code
    visited_states = []
    start_time = time.time()
    steps = 0
    # ... BFS durchführen, Zwischenschritte in visited_states sammeln ...
    runtime = time.time() - start_time
    return {
        "visitedStates": visited_states,  # Liste mit allen Zwischenschritten
        "steps": steps,
        "runtime": runtime
    }

if __name__ == '__main__':
    # Einfaches CLI-Interface: python maze_algorithms.py BFS <maze_parameter>
    algorithm = sys.argv[1]

    # Maze können wir generieren oder als Parameter erhalten
    if algorithm == "BFS":
        result = bfs(None)
        print(result)
    # etc. für DFS, Dijkstra, A*, Q-Learning
