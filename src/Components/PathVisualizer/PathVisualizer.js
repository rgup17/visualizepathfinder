import React, {Component} from 'react';
import Node from "../Node/Node";
import "./PathVisualizer.css";
import { animatePath, clearAnimationTimeouts, animateWalls, setVisualizationState } from '../../Visualizers/MainVisualizers';

import { dijkstra, bfs, dfs, recursiveDivisionMaze, getNodesInShortestPathOrder } from "../../Algorithms/CommonMethods";

//create initial positions for start and finish nodes

const START_NODE_ROW = 10;
const START_NODE_COL = 4;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


class PathVisualizer extends Component {

    //define initial state
    state = {
        grid: [],
        mouseIsPressed: false,
        isPathNotFound: false,
        visitedNodes: 0,
        shortestNodes: 0, 
        isVisualizing: false,
        isAnimated: false,
        hasPathVisible: false,
        mainIsPressed: "",
        startNode_Pos: [START_NODE_ROW, START_NODE_COL],
        finishNode_Pos: [FINISH_NODE_ROW, FINISH_NODE_COL],
    }

    //creates grid when mounted
    componentDidMount() {
        const {startNode_Pos, finishNode_Pos} = this.state;
        let grid = createInitialGrid(startNode_Pos, finishNode_Pos);
        this.setState({grid});
    }


    /* -------- handle mouse events --------- */
     handleMouseDown(row, col) {
        const { grid, mainIsPressed } = this.state;
        const node = grid[row][col];
        if (node.isStart === true && node.isFinish === false) {
            if (this.state.isVisualizing || this.state.isAnimated) return;
            this.setState({ mainIsPressed: "start" });
            node.isStart = false;
        }
        if (node.isFinish === true && node.isStart === false) {
            if (this.state.isVisualizing ||this.state.isAnimated) return;
            this.setState({ mainIsPressed: "finish" });
            node.isFinish = false;
        }
        if (mainIsPressed === "") {
            if (this.state.isVisualizing || this.state.isAnimated) return;
            const newGrid = gridWithWallToggled(grid, row, col);
            this.setState({ grid: newGrid, mouseIsPressed: true });
        }
    }
    
    handleMouseEnter(row, col) {
        const { grid, mouseIsPressed, mainIsPressed } = this.state;
        if (mainIsPressed === "start") {
            const newGrid = gridDynamicNodes(grid, row, col, "start");
            this.setState({ grid: newGrid, startNode_Pos: [row, col] });
        }
        if (mainIsPressed === "finish") {
            const newGrid = gridDynamicNodes(grid, row, col, "finish");
            this.setState({ grid: newGrid, finishNode_Pos: [row, col] });
        }
        if (mouseIsPressed && mainIsPressed === "") {
            const newGrid = gridWithWallToggled(grid, row, col);
            this.setState({ grid: newGrid });
        }
    }

    handleMouseUp(row,col) {
        const { mainIsPressed, grid } = this.state;
        if (mainIsPressed === "start") {
            this.setState({ mainIsPressed: "" });
            const startNode_Pos = [row, col];
            const newGrid = gridDynamicNodes(grid, row, col, "start");
            this.setState({ mainIsPressed: "", startNode_Pos, grid: newGrid });
        }
        if (mainIsPressed === "finish") {
            const finishNode_Pos = [row, col];
            const newGrid = gridDynamicNodes(grid, row, col, "finish");
            this.setState({ mainIsPressed: "", finishNode_Pos, grid: newGrid });
        }
        this.setState({ mouseIsPressed: false });
    }

     handleMouseLeave(row, col) {
        const { grid, mainIsPressed } = this.state;
        if (mainIsPressed === "")
            return;
        let newGrid = grid.slice();
        const node = newGrid[row][col];
        if (mainIsPressed === "start") {
            const newNode = {
                ...node,
                isStart: false,
                isWall: false
            }
            newGrid[row][col] = newNode;
        }
        if (mainIsPressed === "finish") {
            const newNode = {
                ...node,
                isFinish: false,
                isWall: false
            }
            newGrid[row][col] = newNode;
        }
        this.setState({ grid: newGrid, mouseIsPressed: false });
    }

    setVisualization = () => {
      this.setState({
          isVisualizing: !this.state.isVisualizing
      });
  }


  handleClick = () => {
    setVisualizationState(this);
}

    /* --------------- visualize algorithms ------------- */
    visualizeDijkstra = () => {

      this.clearPath();

      this.setState({
        isVisualizing: false,
      })

      if (this.state.isVisualizing) return; 
      const {grid, startNode_Pos, finishNode_Pos} = this.state;
      const start_X = startNode_Pos[0];
      const start_Y = startNode_Pos[1];
      const startNode = grid[start_X][start_Y];
      const finish_X = finishNode_Pos[0];
      const finish_Y = finishNode_Pos[1];
      const finishNode = grid[finish_X][finish_Y];

      this.setState({
        isVisualizing: true
      });

      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);


      animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);

    }

    visualizeBFS = () => {
      this.clearPath();
      this.setState({
        isVisualizing: false
      })
      if (this.state.isVisualizing) return; //don't do anything if it's already trying to be visualized
      const {grid, startNode_Pos, finishNode_Pos} = this.state;
      const start_X = startNode_Pos[0];
      const start_Y = startNode_Pos[1];
      const startNode = grid[start_X][start_Y];
      const finish_X = finishNode_Pos[0];
      const finish_Y = finishNode_Pos[1];
      const finishNode = grid[finish_X][finish_Y];

      this.setState({
        isVisualizing: true
      });

      const visitedNodesInOrder = bfs(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

      animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    }

    visualizeDFS = () => {
      this.clearPath();
      this.setState({
        isVisualizing: false
      })
      if (this.state.isVisualizing) return; //don't do anything if it's already trying to be visualized
      const {grid, startNode_Pos, finishNode_Pos} = this.state;
      const start_X = startNode_Pos[0];
      const start_Y = startNode_Pos[1];
      const startNode = grid[start_X][start_Y];
      const finish_X = finishNode_Pos[0];
      const finish_Y = finishNode_Pos[1];
      const finishNode = grid[finish_X][finish_Y];

      this.setState({
        isVisualizing: true
      });

      const visitedNodesInOrder = dfs(grid, startNode, finishNode);
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);

      animatePath(this, visitedNodesInOrder, nodesInShortestPathOrder, startNode, finishNode);
    }

    /* -------------------- clear ------------------- */
    clearPath = () => {
      if (this.state.isVisualizing) {
        return;
      }
      
      clearAnimationTimeouts();

      for (let row = 0; row < this.state.grid.length; row++) {
        for (let col = 0; col < this.state.grid[0].length; col++) {
            if ((document.getElementById(`node-${row}-${col}`).className === "node node-shortest-path") || document.getElementById(`node-${row}-${col}`).className === "node node-visited") {
                document.getElementById(`node-${row}-${col}`).className = "node";
            }
        }

      const newGrid = getGridWithoutPath(this.state.grid);
      this.setState({grid: newGrid});
    }

    const {grid} = this.state;
      let newGrid = grid.slice();
      for (let row of grid) {
        for (let node of row) {
          let newNode = {
              ...node,
              distance: Infinity,
              isVisited: false,
              previousNode: null,
              distanceToFinishNode: Math.abs(FINISH_NODE_ROW - node.row) + Math.abs(FINISH_NODE_COL - node.col)
          };
          newGrid[node.row][node.col] = newNode;
        }
      }
    
      this.setState({grid: newGrid});
    
    }

    clearGrid = () => {
      if (this.state.isVisualizing) return;

      const {startNode_Pos, finishNode_Pos} = this.state;
      const startX = startNode_Pos[0], startY = startNode_Pos[1];
      const finishX = finishNode_Pos[0], finishY = finishNode_Pos[1];

      for (let row = 0; row < this.state.grid.length; row++) {
        for (let col = 0; col < this.state.grid[0].length; col++) {
          if (!((row === startX && col === startY ) || (row === finishX && col === finishY))) {
            document.getElementById(`node-${row}-${col}`).className = "node";
          }
        }
      }

      const newGrid = createInitialGrid(startNode_Pos, finishNode_Pos);
      this.setState({
        grid: newGrid
      })

    }

    animateWalls = (walls, grid) => {
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


    visualizeRecursiveDivisionMaze = () => {
      this.clearPath();
      if (this.state.isVisualizing) return;
      this.setState({isVisualizing: true});
      const { grid, startNode_Pos,finishNode_Pos } = this.state;
      const startNode = grid[startNode_Pos[0]][startNode_Pos[1]];
      const finishNode = grid[finishNode_Pos[0]][finishNode_Pos[1]];
      const walls = recursiveDivisionMaze(grid, startNode, finishNode);
      this.animateWalls(walls, grid);
    }
 

    /* ------------------ render --------------- */

    render() {
        const {grid, mouseIsPressed, visitedNodes, shortestNodes} = this.state;
    
        return (
          <>
            <button
              className="handleButtonDijkstra"
              onClick={() => {
                this.visualizeDijkstra();
                this.setState({ isVisualizing: true });
              
              }}
              disabled={this.state.isVisualizing}
              >
              Visualize Dijkstra's Algorithm
            </button>

            <button
              className = "handleButtonBFS"
              onClick={() => {
                this.visualizeBFS();
                this.setState({ isVisualizing: true});
              }}
              disabled={this.state.isVisualizing}
              >
              Visualize BFS
            </button>

            <button
              className = "handleButtonDFS"
              onClick={() => {
                this.visualizeDFS();
                this.setState({isVisualizing: true});
              }}
              disabled={this.state.isVisualizing}
              >
              Visualize DFS 
            </button>

            <button
              className = "handleButtonRecDivMaze"
              onClick={() => {
                this.visualizeRecursiveDivisionMaze();
                this.setState({isVisualizing: true});
              }}
              disabled={this.state.isVisualizing}
            >
              Create Maze
            </button>

            <button className = "clearPath"
              onClick={() => this.clearPath()}
              disabled={this.state.isVisualizing}
              >
              Clear Path 
            </button>   

            <button className = "clearGrid"
              onClick={() => this.clearGrid()}
              disabled={this.state.isVisualizing}
              
              >
              Clear Grid
            </button>    

            <div className="grid">
              {grid.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const {row, col, isFinish, isStart, isWall} = node;
                      return (
                        <Node
                          key={nodeIdx}
                          row={row}
                          col={col}
                          isFinish={isFinish}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                          onMouseLeave = {(row, col) => this.handleMouseLeave(row, col)}
                          onMouseUp = {(row, col) => this.handleMouseUp(row, col)}
                          ></Node>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        );
      }

}


export default PathVisualizer;


/*-------------------- Helper functions  ------------------ */

    

//Create initial grid

const createInitialGrid = (startNode_Pos, finishNode_Pos) => {
    let grid = [];

    for (let row = 0 ; row < 21; row ++) {
        const currRow = [];
        for (let col = 0; col < 40; col ++) {
            currRow.push(createNode(row, col, startNode_Pos, finishNode_Pos));
        }
        grid.push(currRow);
    }

    return grid;
}

//initialize node

const createNode = (row, col, startNode, finishNode) => {

  let startX = startNode[0];
  let startY = startNode[1];
  let finishX = finishNode[0];
  let finishY = finishNode[1];


  return {
    row,
    col,
    isStart: row === startX && col === startY,
    isFinish: row === finishX && col === finishY,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    distanceToFinishNode: Math.abs(finishX - row) + Math.abs(finishY - col),  
  }
};


//create dynamicNodes
const gridDynamicNodes = (grid, row, col, pos) => {
  let newGrid = grid.slice();
  const node = newGrid[row][col];
  if (pos === "start") {
    const newNode = {
      ...node, //... means it has all the properties of node
      isStart: true
    }
    newGrid[row][col] = newNode;
  }
  if (pos === "finish") {
    const newNode = {
      ...node,
      isFinish: true
    }
    newGrid[row][col] = newNode;

  }

  return newGrid;
}

//update grid when you create walls

const gridWithWallToggled = (grid, row, col) => {
  let newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
      ...node,
      isWall: !node.isWall
  }
  newGrid[row][col] = newNode;
  return newGrid;
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

const getGridWithoutPath = (grid) => {
  let newGrid = grid.slice();
  for (let row of grid) {
    for (let node of row) {
      let newNode = {
        ...node,
        distance: Infinity, 
        isVisited: false, 
        previousNode: null, 
        distanceToFinishNode: Math.abs(FINISH_NODE_ROW - node.row) + Math.abs(FINISH_NODE_COL - node.col)
      };
      newGrid[node.row][node.col] = newNode;
    }
  }

  return newGrid;
}