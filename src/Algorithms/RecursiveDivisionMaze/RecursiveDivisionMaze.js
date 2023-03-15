let walls;

export function recursiveDivisionMaze(grid, startNode, finishNode) {

    if (!startNode || !finishNode) return;
    let vert = Array(grid[0].length).fill().map((_, i) => i);
    let hor = Array(grid.length).fill().map((_, i) => i);
    let direction;
    let randomNum;

    walls = [];

    recursiveTrackWalls(vert, hor, grid, startNode, finishNode);

    return walls;

}

function recursiveTrackWalls(vert, hor, grid, startNode, finishNode) {

    if (vert.length < 2 || hor.length < 2) return;


    let direction;
    let randomNum;


    //to determine the direction the wall is drawn, is direction is 1, it is horizontal. if 0, vertical
    if (vert.length > hor.length) {
        direction = 0; //vertical
        randomNum = getOddNumber(vert);

    }
    if (vert.length <= hor.length) {
        direction = 1; //horizontal
        randomNum = getOddNumber(hor);
    }


    //if vertical 
    if (direction === 1) {
        makeWalls(direction, randomNum, vert, hor, startNode, finishNode);
        recursiveTrackWalls(vert, hor.slice(0, hor.indexOf(randomNum)), grid, startNode, finishNode);
        recursiveTrackWalls(vert, hor.slice(hor.indexOf(randomNum) + 1), grid, startNode, finishNode);
    } else {
        makeWalls(direction, randomNum, vert, hor, startNode, finishNode);
        recursiveTrackWalls(vert.slice(0, vert.indexOf(randomNum)), hor, grid, startNode, finishNode);
        recursiveTrackWalls(vert.slice(vert.indexOf(randomNum) + 1), hor, grid, startNode, finishNode);
    }
}


function makeWalls(dir, num, vertical, horizontal, startNode, finishNode) {
    let isStartFinish = false;
    let tempWalls = [];
    if (dir === 0) {
      if (horizontal.length === 2)
        return;
      for (let temp of horizontal) {
        if ((temp === startNode.row && num === startNode.col) ||(temp === finishNode.row && num === finishNode.col)) {
          isStartFinish = true;
          continue;
        }
        tempWalls.push([temp, num]);
      }
    }
    else {
      if (vertical.length === 2)
        return;
      for (let temp of vertical) {
        if ((num === startNode.row && temp === startNode.col) ||(num === finishNode.row && temp === finishNode.col)) {
          isStartFinish = true;
          continue;
        }
        tempWalls.push([num, temp]);
      }
    }
    if (!isStartFinish) {
      let rand = getRandomNumber(tempWalls.length);
      tempWalls= [...tempWalls.slice(0, rand), ...tempWalls.slice(rand + 1)];
    }
    for (let wall of tempWalls) {
      walls.push(wall);
    }
  }


function getOddNumber(arr) {
    let max = arr.length -1;
    let rNum = Math.floor(Math.random() * (max/2));
    if (rNum % 2 === 0) {
        if (rNum === max) rNum --;
        else rNum++;
    }

    return arr[rNum];
}


function getRandomNumber(maxValue) {
    let randomNum = Math.floor(Math.random() * (maxValue / 2));
    if (randomNum % 2 !== 0) {
      if (randomNum === maxValue) {
        randomNum -= 1;
      }
      else {
        randomNum += 1;
      }
    }
    return randomNum;
  }