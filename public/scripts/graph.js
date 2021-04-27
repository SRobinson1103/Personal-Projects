/**
 *   @author Sean Robinson
 *   @version 26FEB2021
 */

//A vertex class for the graph
class vertex {
  constructor(value, manhattanDistance, depth, edges, x, y) {
    this.value = value;
    this.edges = edges;
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.manhattanDistance = manhattanDistance;
  }
}

//Set up the canvas
let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");
let width = (myCanvas.width = window.innerWidth - 100);
let height = (myCanvas.height = window.innerHeight - 100);

//The dimensions of the canvas
const size = 20;

//The graph
let myGraph = [];

//The dimensions of the nodes
let rectHeight = height / size;
let rectWidth = width / size;

//The algorithm selected by the user
let myAlgorithm = "none";

//Starting and ending locations
let startX = 0;
let startY = 0;
let endX = 15;
let endY = 10;

/**
 * Code to be run once the page is loaded.
 * Builds the graph, adds listeners, and draws the canvas.
 */
$(document).ready(function (e) {
  //build the graph
  buildGraph();

  /*
   * Clicking the barrierButton will enable the user to fill a node in the graph on mouse click.
   * These nodes represent a barrier during traversal.
   */
  $("#barrierButton").on("click", function () {
    $("#myCanvas").on("click", function (e) {
      var posX = $(this).offset().left,
        posY = $(this).offset().top;
      let x = Math.floor((e.pageX - posX) / rectWidth);
      let y = Math.floor((e.pageY - posY) / rectHeight);
      if ((x != startX || y != startY) && (x != endX || y != endY)) {
        //barrier nodes will have a value of -1
        myGraph[x + y * size].value = -1;
        fillNode(x, y, "#FF0000");
      }
    });
  });

  //draw the canvas
  loadCanvas();
});

/**
 * Build the adjacency list to represent the graph.
 */
function buildGraph() {
  let theEdges;
  //Add edges to each node
  for (i = 0; i < size * size; i++) {
    theEdges = [];
    //left
    if (Math.abs(i - 1) % size < i % size) {
      theEdges.push(i - 1);
    }
    //top
    if (i - size >= 0) {
      theEdges.push(i - size);
    }
    //right
    if ((i + 1) % size > i % size) {
      theEdges.push(i + 1);
    }
    //bottom
    if (i + size < size * size) {
      theEdges.push(i + size);
    }
    //add the vertex, empty nodes will have a value of 0
    myGraph.push(new vertex(0, 0, 0, theEdges, i % size, Math.floor(i / size)));
  }
}

/**
 * Initiate the search algorithm based on the user selection.
 */
function start() {
  //disable buttons
  $("#myCanvas").off("click");
  $("#startButton").prop("disabled", true);
  $("#barrierButton").prop("disabled", true);
  $("#clearButton").prop("disabled", true);
  if (myAlgorithm == "BFS") {
    BFS();
  } else if (myAlgorithm == "DFS") {
    DFS();
  } else if (myAlgorithm == "GBFS") {
    GBFS();
  } else if (myAlgorithm == "AStar") {
    AStar();
  }
  //re-enable the start button
  $("#startButton").prop("disabled", false);
  $("#barrierButton").prop("disabled", false);
  $("#clearButton").prop("disabled", false);
}

/**
 * Redraw the canvas and create a blank graph
 */
function restart() {
  //reset graph values
  for (i = 0; i < size * size; i++) {
    myGraph[i].value = 0;
    myGraph[i].depth = 0;
    myGraph[i].manhattanDistance = 0;
  }
  loadCanvas();
}

/**
 *
 */
function changeY(y) {
  startY = parseInt(y);
  restart();
}

/**
 *
 */
function changeX(x) {
  startX = parseInt(x);
  restart();
}

/**
 * Get the selected algorithm from the dropdown menu.
 * @param {*} theAlgorithm the user selected algorithm to use.
 */
function getAlgorithm(theAlgorithm) {
  myAlgorithm = theAlgorithm;
}

/**
 * http://www.sitepoint.com/delay-sleep/pause-wait/
 * Allows sleeping.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/******************************************************************
 *                      Canvas Functions                          *
 ******************************************************************/

/**
 * Draw the starting canvas.
 */
function loadCanvas() {
  drawLines();
  fillNode(startX, startY, "#000000");
  fillNode(endX, endY, "#0000FF");
  //The starting node value will be 1, the ending node value will be 2
  myGraph[startX + startY * size].value = 1;
  myGraph[endX + endY * size].value = 2;
}

/**
 * Clear the canvas.
 */
function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Draw the graph.
 */
function drawLines() {
  //Clear the canvas
  clearCanvas();
  //Start a new path and draw each line in the graph
  ctx.beginPath();
  for (h = 0; h < size; h++) {
    ctx.moveTo(0, (h * height) / size);
    ctx.lineTo(width, (h * height) / size);
    ctx.moveTo((h * width) / size, 0);
    ctx.lineTo((h * width) / size, height);
  }
  ctx.stroke();
}

/**
 * Fill a square in the graph.
 * @param {*} x The x position.
 * @param {*} y The y position
 * @param {*} theColor The fill color.
 */
function fillNode(x, y, theColor) {
  ctx.fillStyle = theColor;
  ctx.fillRect(
    x * rectWidth + 1,
    y * rectHeight + 1,
    rectWidth - 2,
    rectHeight - 2
  );
}

/******************************************************************
 *                      Search Algorithms                         *
 ******************************************************************/

/**
 * Perform the breadth first search algorithm.
 */
async function BFS() {
  let theQueue = [];
  //Enqueue the starting node
  theQueue.push(startY * size + startX);
  let current;

  while (theQueue.length != 0) {
    //remove the next node in the queue and fill it in as black
    current = theQueue.shift();

    //break out of the search when the ending point is found
    if (myGraph[current].value == 2) {
      fillNode(myGraph[current].x, myGraph[current].y, "#00FFFF");
      break;
    }
    fillNode(myGraph[current].x, myGraph[current].y, "#000000");
    await sleep(50);

    //for each edge of the current node, if it hasnt been visited add it to the queue
    for (i = 0; i < myGraph[current].edges.length; i++) {
      let vert = myGraph[current].edges[i];
      if (myGraph[vert].value == 0) {
        myGraph[vert].value = 1;
        theQueue.push(vert);
      } else if (myGraph[vert].value == 2) {
        theQueue.push(vert);
      }
    }
  }
}

/**
 * Perform the depth first search algorithm.
 */
async function DFS() {
  let theStack = [];
  //Enqueue the starting node
  theStack.push(startY * size + startX);
  myGraph[startY * size + startX].value = 0;
  let current;

  while (theStack.length != 0) {
    //remove the next node in the stack and fill it in as black
    current = theStack.pop();

    if (myGraph[current].value == 1) {
      continue;
    }
    //break out of the search when the ending point is found
    if (myGraph[current].value == 2) {
      fillNode(myGraph[current].x, myGraph[current].y, "#00FFFF");
      break;
    }
    myGraph[current].value = 1;
    fillNode(myGraph[current].x, myGraph[current].y, "#000000");
    await sleep(10);

    //for each edge of the current node, if it hasnt been visited add it to the stack
    for (i = 0; i < myGraph[current].edges.length; i++) {
      let vert = myGraph[current].edges[i];
      if (myGraph[vert].value == 0 || myGraph[vert].value == 2) {
        theStack.push(vert);
      }
    }
  }
}

/**
 *
 */
async function GBFS() {
  let priorityQueue = [];
  //Enqueue the starting node
  myGraph[startY * size + startX].manhattanDistance = Math.abs(
    startX - endX + (startY - endY)
  );
  priorityQueue.push(startY * size + startX);
  let current;

  while (priorityQueue.length > 0) {
    for (i = 0; i < priorityQueue.length; i++) {
      let m = myGraph[priorityQueue[i]].manhattanDistance;
      console.log(m);
    }
    //remove the next node in the priority queue
    current = priorityQueue.shift();

    //break out of the search when the ending point is found
    if (myGraph[current].value == 2) {
      fillNode(myGraph[current].x, myGraph[current].y, "#00FFFF");
      break;
    }
    fillNode(myGraph[current].x, myGraph[current].y, "#000000");
    await sleep(50);

    //for each edge of the current node, if it hasnt been visited add it to the priority queue and
    //calculate the manhattan distance
    for (i = 0; i < myGraph[current].edges.length; i++) {
      let vert = myGraph[current].edges[i];
      if (myGraph[vert].value == 0 || myGraph[vert].value == 2) {
        myGraph[vert].manhattanDistance =
          Math.abs(myGraph[vert].x - endX) + Math.abs(myGraph[vert].y - endY);
        enqueuePQ(priorityQueue, vert, false);
      }
      //Mark as visited
      if (myGraph[vert].value == 0) {
        myGraph[vert].value = 1;
      }
    }
  }
}

/**
 *
 */
async function AStar() {
  let priorityQueue = [];
  //Enqueue the starting node
  myGraph[startY * size + startX].manhattanDistance = Math.abs(
    startX - endX + (startY - endY)
  );
  priorityQueue.push(startY * size + startX);
  let current;

  while (priorityQueue.length > 0) {
    for (i = 0; i < priorityQueue.length; i++) {
      let d = myGraph[priorityQueue[i]].depth;
      let m = myGraph[priorityQueue[i]].manhattanDistance;
      let total = m + d;
      console.log(total);
    }
    console.log("------------------------------");
    //remove the next node in the priority queue
    current = priorityQueue.shift();

    //break out of the search when the ending point is found
    if (myGraph[current].value == 2) {
      fillNode(myGraph[current].x, myGraph[current].y, "#00FFFF");
      break;
    }
    fillNode(myGraph[current].x, myGraph[current].y, "#000000");
    await sleep(50);

    //for each edge of the current node, if it hasnt been visited add it to the priority queue and
    //calculate the manhattan distance
    let theDepth = myGraph[current].depth;
    for (i = 0; i < myGraph[current].edges.length; i++) {
      let vert = myGraph[current].edges[i];
      if (myGraph[vert].value == 0 || myGraph[vert].value == 2) {
        myGraph[vert].manhattanDistance =
          Math.abs(myGraph[vert].x - endX) + Math.abs(myGraph[vert].y - endY);
        myGraph[vert].depth = theDepth + 0.5;
        enqueuePQ(priorityQueue, vert, true);
      }
      //Mark as visited
      if (myGraph[vert].value == 0) {
        myGraph[vert].value = 1;
      }
    }
  }
}

/**
 * Enqueue method to order items in a priority queue by their manhattan distance and depth.
 * @param {*} list The priority queue.
 * @param {*} item The item to add.
 */
function enqueuePQ(list, item, useDepth) {
  let inserted = false;
  if (useDepth) {
    for (i = 0; i < list.length; i++) {
      let pos = list[i];
      if (
        myGraph[item].manhattanDistance + myGraph[item].depth <
        myGraph[pos].manhattanDistance + myGraph[pos].depth
      ) {
        list.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
  } else {
    for (i = 0; i < list.length; i++) {
      let pos = list[i];
      if (myGraph[item].manhattanDistance < myGraph[pos].manhattanDistance) {
        list.splice(i, 0, item);
        inserted = true;
        break;
      }
    }
  }

  if (!inserted) {
    list.push(item);
  }
}
