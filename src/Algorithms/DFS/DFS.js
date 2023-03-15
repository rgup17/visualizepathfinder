export function dfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const stack = [];
    stack.push(startNode);

    while (stack.length) {
        const currNode = stack.pop();

        if (currNode === finishNode) return visitedNodesInOrder;

        if (!currNode.isWall && (!currNode.isVisited || currNode.isStart)) {
            currNode.isVisited = true;
            visitedNodesInOrder.push(currNode);
            const {row, col} = currNode;
            updateUnvisitedNeighbors(stack, row, col, grid, currNode);

        }
    }
}

function updateUnvisitedNeighbors(stack, row, col, grid, currNode) {
    let next;
      if (row > 0) {
        next = grid[row - 1][col];
        if (!next.isVisited) {
          next.previousNode = currNode;
          stack.push(next);
        }
      }
      if (row < grid.length - 1) {
        next = grid[row + 1][col];
        if (!next.isVisited) {
          next.previousNode = currNode;
          stack.push(next);
        }
      }
      if (col < grid[0].length - 1) {
        next = grid[row][col + 1];
        if (!next.isVisited) {
          next.previousNode = currNode;
          stack.push(next);
        }
      }
      if (col > 0) {
        next = grid[row][col - 1];
        if (!next.isVisited) {
          next.previousNode = currNode;
          stack.push(next);
        }
      }
}