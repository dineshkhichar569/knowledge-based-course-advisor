from typing import Dict, Any
import random

class World:
    def __init__(self, rows: int, cols: int, pit_prob=0.12, mon_prob=0.08, seed=None):
        self.rows, self.cols = rows, cols
        rng = random.Random(seed)
        self.grid = []
        for r in range(rows):
            row = []
            for c in range(cols):
                row.append({
                    "pit": rng.random() < pit_prob,
                    "monster": rng.random() < mon_prob
                })
            self.grid.append(row)

    def sense(self, r: int, c: int) -> Dict[str, bool]:
        # breeze if any neighbor has pit; stench if any neighbor has monster
        def neighbors(rr, cc):
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                r2, c2 = rr+dr, cc+dc
                if 0 <= r2 < self.rows and 0 <= c2 < self.cols:
                    yield r2, c2

        breeze = any(self.grid[rr][cc]["pit"] for rr,cc in neighbors(r,c))
        stench = any(self.grid[rr][cc]["monster"] for rr,cc in neighbors(r,c))
        return {"breeze": breeze, "stench": stench}

    def snapshot(self) -> Any:
        # Don’t reveal hazards to the UI (for demo fairness). Keep hidden.
        return {"rows": self.rows, "cols": self.cols}
