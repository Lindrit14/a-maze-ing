#!/usr/bin/env python3
import sys
import json
import numpy as np
import random

def run_q_learning(maze, start, end, episodes, max_steps_per_episode=200):
    """
    Run Q-Learning on the given maze for `episodes` count.
    Reward scheme:
      - -1 for each step,
      - -100 for hitting a wall,
      - +100 at the goal.
    """
    rows = len(maze)
    cols = len(maze[0])

    # Actions (Up=0, Right=1, Down=2, Left=3)
    actions = [(-1, 0), (0, 1), (1, 0), (0, -1)]  # Up, Right, Down, Left

    # Q-values: shape (rows, cols, 4)
    Q = np.zeros((rows, cols, 4), dtype=float)

    # Reward grid
    R = np.full((rows, cols), -1, dtype=float)  # Default reward for each step
    for r in range(rows):
        for c in range(cols):
            if maze[r][c] == 1:  # Wall
                R[r][c] = -100
    R[end[0]][end[1]] = 100  # Goal cell reward

    def in_bounds(r, c):
        return 0 <= r < rows and 0 <= c < cols

    def is_terminal(r, c):
        return (r == end[0] and c == end[1]) or maze[r][c] == 1

    # Hyperparameters
    epsilon = 0.8  # Exploration rate (high at start)
    gamma = 0.9    # Discount factor
    alpha = 0.9    # Learning rate

    all_episodes_data = []
    for e in range(episodes):
        visited_path = []
        r, c = start
        total_reward = 0

        steps = 0
        while not is_terminal(r, c) and steps < max_steps_per_episode:
            steps += 1
            if random.random() < epsilon:
                a = random.randint(0, 3)  # Explore
            else:
                a = np.argmax(Q[r, c, :])  # Exploit

            dr, dc = actions[a]
            nr, nc = r + dr, c + dc

            if not in_bounds(nr, nc):
                reward = -100
                total_reward += reward
                break
            else:
                visited_path.append([r, c])
                reward = R[nr][nc]
                total_reward += reward

                # Q-update
                old_q = Q[r, c, a]
                future_val = 0 if is_terminal(nr, nc) else np.max(Q[nr, nc, :])
                Q[r, c, a] = old_q + alpha * (reward + gamma * future_val - old_q)

                r, c = nr, nc

        # Gradually reduce exploration rate
        epsilon = max(0.1, epsilon * 0.99)

        ep_data = {"episodeIndex": e, "visitedStates": visited_path, "totalReward": total_reward}
        all_episodes_data.append(ep_data)

    best_path = []
    rr, cc = start
    while True:
        best_path.append([rr, cc])
        if (rr, cc) == end or maze[rr][cc] == 1:
            break
        a = np.argmax(Q[rr, cc, :])
        rr += actions[a][0]
        cc += actions[a][1]
        if not in_bounds(rr, cc):
            break

    return {"episodesData": all_episodes_data, "bestPath": best_path}

if __name__ == "__main__":
    input_data = sys.stdin.read()
    obj = json.loads(input_data)
    maze = obj.get("maze", [])
    start = obj.get("start", [1, 1])
    end = obj.get("end", [9, 9])
    episodes = obj.get("episodes", 10)

    result = run_q_learning(maze, tuple(start), tuple(end), episodes)
    print(json.dumps(result))
