// A* Pathfinding Algorithm for AI Snake Fallback
// Used when Bedrock API is unavailable or fails

export class AStarPathfinder {
    constructor() {
        this.maxIterations = 1000; // Prevent infinite loops
    }
    
    /**
     * Find path from start to goal using A* algorithm
     * @param {Object} start - Starting position {x, y}
     * @param {Object} goal - Goal position {x, y}
     * @param {Set} obstacles - Set of obstacle positions as "x,y" strings
     * @param {number} gridSize - Size of the grid
     * @returns {Array|null} Path as array of positions, or null if no path
     */
    findPath(start, goal, obstacles, gridSize) {
        const openSet = [start];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const startKey = this.positionKey(start);
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(start, goal));
        
        let iterations = 0;
        
        while (openSet.length > 0 && iterations < this.maxIterations) {
            iterations++;
            
            // Get node with lowest fScore
            const current = this.getLowestFScore(openSet, fScore);
            const currentKey = this.positionKey(current);
            
            // Reached goal
            if (current.x === goal.x && current.y === goal.y) {
                return this.reconstructPath(cameFrom, current);
            }
            
            // Move current from open to closed set
            const currentIndex = openSet.findIndex(pos => 
                pos.x === current.x && pos.y === current.y
            );
            openSet.splice(currentIndex, 1);
            closedSet.add(currentKey);
            
            // Check all neighbors
            const neighbors = this.getNeighbors(current, gridSize);
            
            for (const neighbor of neighbors) {
                const neighborKey = this.positionKey(neighbor);
                
                // Skip if in closed set or is obstacle
                if (closedSet.has(neighborKey) || obstacles.has(neighborKey)) {
                    continue;
                }
                
                const tentativeGScore = gScore.get(currentKey) + 1;
                
                // Check if neighbor is already in open set
                const neighborInOpen = openSet.find(pos => 
                    pos.x === neighbor.x && pos.y === neighbor.y
                );
                
                if (!neighborInOpen) {
                    // Add to open set
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
                    // Not a better path
                    continue;
                }
                
                // This is the best path so far
                cameFrom.set(neighborKey, current);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, goal));
            }
        }
        
        // No path found
        return null;
    }
    
    /**
     * Get next move direction from A* pathfinding
     * @param {Object} start - Starting position
     * @param {Object} goal - Goal position
     * @param {Array} playerBody - Player snake body
     * @param {Array} aiBody - AI snake body
     * @param {number} gridSize - Grid size
     * @returns {string|null} Direction (UP, DOWN, LEFT, RIGHT) or null
     */
    getNextMove(start, goal, playerBody, aiBody, gridSize) {
        // Create obstacle set
        const obstacles = new Set();
        
        // Add player snake body (except head - we can potentially collide)
        for (let i = 1; i < playerBody.length; i++) {
            obstacles.add(this.positionKey(playerBody[i]));
        }
        
        // Add AI snake body (except head)
        for (let i = 1; i < aiBody.length; i++) {
            obstacles.add(this.positionKey(aiBody[i]));
        }
        
        // Find path
        const path = this.findPath(start, goal, obstacles, gridSize);
        
        if (!path || path.length < 2) {
            return null;
        }
        
        // Get next position in path
        const nextPos = path[1];
        
        // Convert to direction
        return this.positionToDirection(start, nextPos);
    }
    
    /**
     * Manhattan distance heuristic
     * @param {Object} a - Position A
     * @param {Object} b - Position B
     * @returns {number} Manhattan distance
     */
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    /**
     * Get neighbors of a position
     * @param {Object} pos - Current position
     * @param {number} gridSize - Grid size
     * @returns {Array} Array of neighbor positions
     */
    getNeighbors(pos, gridSize) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 }, // UP
            { dx: 0, dy: 1 },  // DOWN
            { dx: -1, dy: 0 }, // LEFT
            { dx: 1, dy: 0 }   // RIGHT
        ];
        
        for (const { dx, dy } of directions) {
            const newX = pos.x + dx;
            const newY = pos.y + dy;
            
            // Check bounds
            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
                neighbors.push({ x: newX, y: newY });
            }
        }
        
        return neighbors;
    }
    
    /**
     * Get node with lowest fScore from open set
     * @param {Array} openSet - Open set of positions
     * @param {Map} fScore - fScore map
     * @returns {Object} Position with lowest fScore
     */
    getLowestFScore(openSet, fScore) {
        let lowest = openSet[0];
        let lowestScore = fScore.get(this.positionKey(lowest)) || Infinity;
        
        for (let i = 1; i < openSet.length; i++) {
            const score = fScore.get(this.positionKey(openSet[i])) || Infinity;
            if (score < lowestScore) {
                lowest = openSet[i];
                lowestScore = score;
            }
        }
        
        return lowest;
    }
    
    /**
     * Reconstruct path from cameFrom map
     * @param {Map} cameFrom - cameFrom map
     * @param {Object} current - Current position
     * @returns {Array} Path as array of positions
     */
    reconstructPath(cameFrom, current) {
        const path = [current];
        let currentKey = this.positionKey(current);
        
        while (cameFrom.has(currentKey)) {
            current = cameFrom.get(currentKey);
            path.unshift(current);
            currentKey = this.positionKey(current);
        }
        
        return path;
    }
    
    /**
     * Convert position to string key
     * @param {Object} pos - Position {x, y}
     * @returns {string} Position key "x,y"
     */
    positionKey(pos) {
        return `${pos.x},${pos.y}`;
    }
    
    /**
     * Convert two positions to direction
     * @param {Object} from - From position
     * @param {Object} to - To position
     * @returns {string} Direction (UP, DOWN, LEFT, RIGHT)
     */
    positionToDirection(from, to) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        
        if (dx === 1) return 'RIGHT';
        if (dx === -1) return 'LEFT';
        if (dy === 1) return 'DOWN';
        if (dy === -1) return 'UP';
        
        return 'RIGHT'; // Default fallback
    }
    
    /**
     * Find safe move when no path to food exists
     * @param {Object} head - Current head position
     * @param {string} currentDirection - Current direction
     * @param {Array} playerBody - Player snake body
     * @param {Array} aiBody - AI snake body
     * @param {number} gridSize - Grid size
     * @returns {string|null} Safe direction or null
     */
    findSafeMove(head, currentDirection, playerBody, aiBody, gridSize) {
        const obstacles = new Set();
        
        // Add all snake body segments as obstacles
        [...playerBody, ...aiBody.slice(1)].forEach(segment => {
            obstacles.add(this.positionKey(segment));
        });
        
        const directions = [
            { dir: 'UP', dx: 0, dy: -1 },
            { dir: 'DOWN', dx: 0, dy: 1 },
            { dir: 'LEFT', dx: -1, dy: 0 },
            { dir: 'RIGHT', dx: 1, dy: 0 }
        ];
        
        // Reverse direction mapping
        const opposite = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };
        
        const safeMoves = [];
        
        for (const { dir, dx, dy } of directions) {
            // Can't reverse direction
            if (dir === opposite[currentDirection]) continue;
            
            const newPos = { x: head.x + dx, y: head.y + dy };
            
            // Check bounds
            if (newPos.x < 0 || newPos.x >= gridSize || 
                newPos.y < 0 || newPos.y >= gridSize) continue;
            
            // Check obstacles
            if (obstacles.has(this.positionKey(newPos))) continue;
            
            safeMoves.push(dir);
        }
        
        if (safeMoves.length === 0) {
            return null;
        }
        
        // Prefer moves that lead to more open space
        const scoredMoves = safeMoves.map(dir => ({
            direction: dir,
            score: this.scoreOpenSpace(head, dir, obstacles, gridSize)
        }));
        
        scoredMoves.sort((a, b) => b.score - a.score);
        return scoredMoves[0].direction;
    }
    
    /**
     * Score a move based on available open space
     * @param {Object} head - Current head position
     * @param {string} direction - Direction to move
     * @param {Set} obstacles - Obstacle positions
     * @param {number} gridSize - Grid size
     * @returns {number} Open space score
     */
    scoreOpenSpace(head, direction, obstacles, gridSize) {
        const dirMap = {
            'UP': { dx: 0, dy: -1 },
            'DOWN': { dx: 0, dy: 1 },
            'LEFT': { dx: -1, dy: 0 },
            'RIGHT': { dx: 1, dy: 0 }
        };
        
        const { dx, dy } = dirMap[direction];
        const newPos = { x: head.x + dx, y: head.y + dy };
        
        // Count accessible positions using flood fill
        const visited = new Set();
        const queue = [newPos];
        let openSpaces = 0;
        
        while (queue.length > 0 && openSpaces < 50) { // Limit to prevent long calculations
            const pos = queue.shift();
            const key = this.positionKey(pos);
            
            if (visited.has(key)) continue;
            visited.add(key);
            openSpaces++;
            
            // Add neighbors
            const neighbors = this.getNeighbors(pos, gridSize);
            for (const neighbor of neighbors) {
                const neighborKey = this.positionKey(neighbor);
                if (!visited.has(neighborKey) && !obstacles.has(neighborKey)) {
                    queue.push(neighbor);
                }
            }
        }
        
        return openSpaces;
    }
}

// Export singleton instance
export const pathfinder = new AStarPathfinder();