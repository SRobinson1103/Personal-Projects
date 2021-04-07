/** 
 *   @author Sean Robinson
 *   @version 26FEB2021 
 */

//A vertex class for the graph
class vertex {
    constructor(value, edges) {
        this.value = value;
        this.edges = edges;
    }
}

//Set up the canvas
let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext('2d');
let width = myCanvas.width  = window.innerWidth;
let height = myCanvas.height = window.innerHeight;

//The dimensions of the canvas
const size = 20;

//The graph
let myGraph = [];

//The dimensions of the nodes
let rectHeight = height/size;
let rectWidth = width/size;

//The algorithm selected by the user
let myAlgorithm = 'none';

//Starting and ending locations
let startX = 4;
let startY = 10;
let endX = 16;
let endY = 10;

/**
 * Code to be run once the page is loaded.
 * Builds the graph, adds listeners, and draws the canvas.
 */
$(document).ready(function(e) {

    //build the graph
    buildGraph();

    /*
     * Clicking the barrierButton will enable the user to fill a node in the graph on mouse click.
     * These nodes represent a barrier during traversal.
     */
    $('#barrierButton').on('click',function(){
        $("#myCanvas").on("click", function(e) {
            var posX = $(this).offset().left, posY = $(this).offset().top;
            let x = Math.floor((e.pageX - posX) / rectWidth);
            let y = Math.floor((e.pageY - posY) / rectHeight);
            //barrier nodes will have a value of -1
            myGraph[x + (y * size)].value = -1;
            fillNode(x, y, "#FF0000");
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
    for (i = 0; i < (size * size); i++) {
        //vertex is on the top row and left column
        if (i == 0) {
            theEdges = [1, size];
        //vertex is on the top row and right column
        } else if (i  == size - 1) {
            theEdges = [size - 2, (size * 2) - 1];
        //vertex is on the bottom row and left column
        } else if (i == (size * size) - size) {
            theEdges = [i - size, i + 1];
        //vertex is on the bottom row and right column
        } else if (i == (size * size) - 1) {
            theEdges = [i - size, i - 1];
        //vertex is in the left column middle row
        } else if (i % size == 0) {
            theEdges = [i - size, i + 1, i + size];
        //vertex is on the right column middle row
        } else if (i % size  == size - 1) {
            theEdges = [i - size, i - 1, i + size];
        //vertex is on the top row
        } else if (i < size) {
            theEdges = [i - 1, i + 1, i + size];
        //vertex is on the bottom row
        } else if (i >= (size * size) - size) {
            theEdges = [i - size, i - 1, i + 1];
        //vertex is not on a side
        } else {
            theEdges = [i - size, i - 1, i + 1, i + size]
        }
        //add the vertex, empty nodes will have a value of 0
        myGraph.push(new vertex(0, theEdges));
    }
}

/**
 * Initiate the search algorithm based on the user selection.
 */
function start() {
    //disable barrier function and start button
    $("#myCanvas").off("click");
    $('#startButton').prop('disabled', true);
    if (myAlgorithm == 'BFS') { 
        BFS();
    } else if (myAlgorithm == 'DFS') {
        DFS(startX + (startY * size));
    }
    //re-enable the start button
    $('#startButton').prop('disabled', false);
}

/**
 * Redraw the canvas and create a blank graph
 */
function restart() {
    //reset graph values
    for (i = 0; i < (size * size); i++) {
        myGraph[i].value = 0;
    }
    loadCanvas();
}

/**
 * Draw the starting canvas.
 */
function loadCanvas() {
    drawLines();
    fillNode(startX, startY, '#000000');
    fillNode(endX, endY, '#0000FF');
    //The starting node value will be 1, the ending node value will be 2
    myGraph[startX + (startY * size)].value = 1;
    myGraph[endX + (endY * size)].value = 2;
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
        ctx.moveTo(0, (h * height/size));
        ctx.lineTo(width, (h * height/size));
        ctx.moveTo((h * width/size), 0);
        ctx.lineTo((h * width/size), height);
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
    ctx.fillRect((x*rectWidth), (y*rectHeight), rectWidth, rectHeight);
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
    return new Promise (
        resolve => setTimeout(resolve, ms)
    );
}

/**
 * Perform the breadth first search algorithm.
 */
async function BFS() {
    let theQueue = [];
    //Enqueue the starting node
    theQueue.push((startY * size) + startX);

    let current;
    while (theQueue.length != 0) {

        //remove the next node in the queue and fill it in as black
        current = theQueue.shift();

        //break out of the search when the ending point is found
        if (myGraph[current].value == 2) {
            fillNode(current % size, Math.floor(current / size),'#00FFFF');
            break;
        }
        fillNode(current % size, Math.floor(current / size),'#000000');

        //sleep to slow down the algorithm for user visualization
        await sleep(25);

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
 * Another sleep function.
 * @param {*} milliseconds The number of miliseconds to sleep.
 * @reference https://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing
 */
function sleep2(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//a global flag to indicate that the end vertex has been found
let found = false;

/**
 * Perform the depth first search algorithm.
 */
async function DFS(vertex) {
    //break from recursion when the end is reached
    if (found == true) {
        return;
    }
    //set the current vertex to 1 and fill it in
    myGraph[vertex].value = 1;
    fillNode(vertex % size, Math.floor(vertex / size),'#000000');
    //recursively call DFS on each edge of the current vertex if it hasn't been visited

    setTimeout(() => { 
    for (i = 0; i < myGraph[vertex].edges.length; i++) {
        let current = myGraph[vertex].edges[i];
        if (myGraph[current].value == 0) {
            DFS(current); 
            timeout += 0.5;
            //DFS(current);
        } else if (myGraph[current].value == 2) {
            fillNode(current % size, Math.floor(current / size),'#00FFFF');
            found = true;
        }
    }
    }, 100);
}
