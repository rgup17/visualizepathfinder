import {setVisualizationState} from "./MainVisualizers";


export function animateWalls(walls, grid) {
    for (let i = 0; i <= walls.length; i++) {
        if (i === walls.length) {
            setTimeout(() => {
                const newGrid = getNewGridWithMaze(this.state.grid, walls);
                this.setState({ grid: newGrid, isVisualizing: false });
            }, 10 * i);
            return ;
        }
        setTimeout(() => {
            const wall = walls[i];
            const node = grid[wall[0]][wall[1]];
            document.getElementById(`node-${node.row}-${node.col}`).className = "node node-animated-wall";
        }, 10 * i);
    }
}

const getNewGridWithMaze = (grid, walls) => {
    let newGrid = grid.slice();
    for (let wall of walls) {
      let node = grid[wall[0]][wall[1]];
      let newNode = {
        ...node,
        isWall: true,
      };
      newGrid[wall[0]][wall[1]] = newNode;
    }
    return newGrid;
  };
