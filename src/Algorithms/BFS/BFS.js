import {getAllNodes, sortNodesByDistance, getUnvisitedNeighbors} from "../CommonMethods";


export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    let queue = [];
    queue.push(startNode);
    while(queue.length) {
        const currNode = queue.shift(); //same thing as queue.dequeue

        //base case
        if (currNode === finishNode) return visitedNodesInOrder; 

        //make sure its not a wall, at the start, or has not been visited yet and is about to

        if (!currNode.isWall && (currNode.isStart || !currNode.isVisited)) {
            currNode.isVisited = true;
            visitedNodesInOrder.push(currNode);
            const {row, col} = currNode;
            updateUnvisitedNeighbors(row, col, queue, grid, currNode);
        }

    }
}


//update the state of the neighbors
function updateUnvisitedNeighbors(row, col, queue, grid, currNode) {
    let next;
    if (row > 0) {
        next = grid[row - 1] [ col];
        if (!next.isVisited) {
            queue.push(next);
            next.previousNode = currNode;
        }
    }

    if (col > 0) {
        next = grid[row][col - 1];
        if (!next.isVisited) {
          queue.push(next);
          next.previousNode = currNode;
        }
    }

    if (row < grid.length - 1) {
        next = grid[row + 1][col];
        if (!next.isVisited) {
          queue.push(next);
          next.previousNode = currNode;
        }
      }

    if (col < grid[0].length - 1) {
        next = grid[row][col + 1];
        if (!next.isVisited) {
          queue.push(next);
          next.previousNode = currNode;
        }
    }

}