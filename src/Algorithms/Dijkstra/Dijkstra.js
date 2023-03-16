// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.



import PriorityQueue from 'js-priority-queue';
import { getAllNodes, getUnvisitedNeighbors } from "../CommonMethods";

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queue = new PriorityQueue({ comparator: (a, b) => a.distance - b.distance });
  startNode.distance = 0;
  queue.queue(startNode);

  while (queue.length !== 0) {
    const closestNode = queue.dequeue();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, queue);
  }
}

function updateUnvisitedNeighbors(node, grid, queue) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const distance = node.distance + 1;
    if (distance < neighbor.distance) {
      neighbor.distance = distance;
      neighbor.previousNode = node;
      queue.queue(neighbor);
    }
  }
}


















// import PriorityQueue from 'js-priority-queue';

// import {getAllNodes, sortNodesByDistance, getUnvisitedNeighbors} from "../CommonMethods";


// export function dijkstra(grid, startNode, finishNode) {
//     const visitedNodesInOrder = [];
//     startNode.distance = 0;
//     const unvisitedNodes = getAllNodes(grid);
//     while (!!unvisitedNodes.length) {
//       sortNodesByDistance(unvisitedNodes);
//       const closestNode = unvisitedNodes.shift();
//       // If we encounter a wall, we skip it.
//       if (closestNode.isWall) continue;
//       // If the closest node is at a distance of infinity,
//       // we must be trapped and should therefore stop.
//       if (closestNode.distance === Infinity) return visitedNodesInOrder;
//       closestNode.isVisited = true;
//       visitedNodesInOrder.push(closestNode);
//       if (closestNode === finishNode) return visitedNodesInOrder;
//       updateUnvisitedNeighbors(closestNode, grid);
//     }
//   }
  
  
//   function updateUnvisitedNeighbors(node, grid) {
//     const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
//     for (const neighbor of unvisitedNeighbors) {
//       neighbor.distance = node.distance + 1;
//       neighbor.previousNode = node;
//     }
//   }
  

  

  