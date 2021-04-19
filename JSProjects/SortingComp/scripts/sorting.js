/**
 *   @author Sean Robinson
 *   @version 20JAN2021
 *   @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */

//Set up the canvas
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth * 0.75);
let height = (canvas.height = window.innerHeight * 0.75);
let choice = "";

//The array of values which will be sorted
let arr = [];

//The size of the array
const size = 150;

const lineSize = 100;

/**
 * Gets the users chosen sorting algorithm from the dropdown
 */
function getAlgorithm(theValue) {
  if (theValue === "Bubble Sort") {
    choice = "bubble";
  } else if (theValue === "Selection Sort") {
    choice = "selection";
  } else if (theValue === "Insertion Sort") {
    choice = "insertion";
  } else if (theValue === "Quick Sort") {
    choice = "quick";
  } else if (theValue === "Pancake Sort") {
    choice = "pancake";
  } else if (theValue === "Cocktail Sort") {
    choice = "cocktail";
  } else {
    choice = "";
  }
}

/**
 * Adds random values to the array
 */
function createValues() {
  arr = [];
  for (i = 0; i < size; i++) {
    //Adds a random number from 0 to 10
    arr.push(Math.random() * 10);
  }
}

/**
 * Draws the bars of the graph
 */
function drawLines(theArray) {
  //Clear the canvas
  clearGraph();
  //Start a new path and draw the bars

  for (h = 0; h < size; h++) {
    ctx.strokeStyle =
      "rgb(" +
      ((20 * h) % 255) +
      ", " +
      ((15 * h) % 255) +
      ", " +
      ((10 * h) % 255) +
      ")";
    ctx.beginPath();
    ctx.moveTo(2, h * 5);
    ctx.lineTo(theArray[h] * lineSize, h * 5);
    ctx.stroke();
  }
}

/**
 * Clears the canvas
 */
function clearGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Starts the user selected sorting algorithm.
 * Disables the selection menu while sorting.
 */
function start() {
  if (choice === "bubble") {
    $("#title").text("BubbleSort");
    bubbleSort();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  } else if (choice === "selection") {
    $("#title").text("SelectionSort");
    selectionSort();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  } else if (choice === "insertion") {
    $("#title").text("InsertionSort");
    insertionSort();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  } else if (choice === "quick") {
    $("#title").text("QuickSort");
    quickSortHelper();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  } else if (choice === "pancake") {
    $("#title").text("PancakeSort");
    pancakeSort();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  } else if (choice === "cocktail") {
    $("#title").text("CocktailSort");
    cocktailSort();
    document.getElementById("mySelect").disabled = true;
    document.getElementById("startButton").disabled = true;
  }
}

/**
 * http://www.sitepoint.com/delay-sleep/pause-wait/
 * Allows sleeping inside of functions.
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * swap two values in an array
 */
function swap(data, index1, index2) {
  let temp = data[index1];
  data[index1] = data[index2];
  data[index2] = temp;
}

/**
 * checks if an array is sorted
 */
function isSorted(data) {
  for (i = 0; i < size - 1; i++) {
    if (data[i] > data[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Finds the maximum element in the array
 */
function findMax(n) {
  let max = 0;
  for (i = 0; i < n; i++) {
    if (arr[i] > arr[max]) {
      max = i;
    }
  }
  return max;
}

/**
 * Sorts the array with the bubblesort algorithm.
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
async function bubbleSort() {
  createValues();
  ctx.strokeStyle = "#2F4858";
  let temp = 0;
  for (i = size - 1; i >= 0; i--) {
    for (j = 0; j <= i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
        await sleep(1);
        drawLines(arr);
      }
    }
  }
  document.getElementById("mySelect").disabled = false;
  document.getElementById("startButton").disabled = false;
}

/**
 * Sorts the array with the insertion sort algorithm
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
async function insertionSort() {
  createValues();
  for (i = 1; i < size; i++) {
    key = arr[i];
    position = i;
    while (position > 0 && arr[position - 1] > key) {
      arr[position] = arr[position - 1];
      position--;
      await sleep(1);
      drawLines(arr);
    }
    arr[position] = key;
    await sleep(1);
    drawLines(arr);
  }
  document.getElementById("mySelect").disabled = false;
  document.getElementById("startButton").disabled = false;
}

/**
 * sort the array with the selectionsort algorithm.
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
async function selectionSort() {
  createValues();
  ctx.strokeStyle = "#2F4858";
  for (i = 0; i < size - 1; i++) {
    min = i;
    for (j = i + 1; j < size; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    swap(arr, i, min);
    await sleep(50);
    drawLines(arr);
  }
  document.getElementById("mySelect").disabled = false;
  document.getElementById("startButton").disabled = false;
}

/**
 * Finds the partition point for the quicksort algorithm
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
function partition(data, min, max) {
  let middle = Math.floor((min + max) / 2);
  let partitionElement = data[middle];
  swap(data, middle, min);
  let left = min;
  let right = max;
  while (left < right) {
    while (left < right && data[left] <= partitionElement) {
      left++;
    }
    while (data[right] > partitionElement) {
      right--;
    }
    if (left < right) {
      swap(data, left, right);
    }
  }
  swap(data, min, right);
  return right;
}

/**
 * prepares and initiates the quickSort algorithm
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
function quickSortHelper() {
  createValues();
  quickSort(arr, 0, size - 1);
}

/**
 * Sort the array using the quicksort algorithm
 * @reference "Java Software Structures", 4th Edition, Lewis and Chase
 */
async function quickSort(data, min, max) {
  if (min < max) {
    setTimeout(() => {
      let indexOfPartition = partition(data, min, max);
      quickSort(data, min, indexOfPartition - 1);
      drawLines(data);
      quickSort(data, indexOfPartition + 1, max);
      drawLines(data);
    }, 250);
  } else if (isSorted(arr)) {
    document.getElementById("mySelect").disabled = false;
    document.getElementById("startButton").disabled = false;
  }
}

/**
 * Flips an array around. Used in pancakesort
 * @reference https://www.geeksforgeeks.org/pancake-sorting/
 */
function flip(i) {
  let temp = 0;
  let start = 0;
  while (start < i) {
    temp = arr[start];
    arr[start] = arr[i];
    arr[i] = temp;
    start++;
    i--;
  }
}

/**
 * Sort the array using the pancakesort algorithm
 * @reference https://www.geeksforgeeks.org/pancake-sorting/
 */
async function pancakeSort() {
  createValues();
  for (curr_size = arr.length; curr_size > 1; curr_size--) {
    let max = findMax(curr_size);
    if (max != curr_size - 1) {
      flip(max);
      await sleep(150);
      drawLines(arr);
      flip(curr_size - 1);
      await sleep(150);
      drawLines(arr);
    }
  }
  document.getElementById("mySelect").disabled = false;
  document.getElementById("startButton").disabled = false;
}

/**
 * Sort the array using the cocktailsort algorithm
 * @reference https://www.geeksforgeeks.org/cocktail-sort/
 */
async function cocktailSort() {
  createValues();
  let swapped = true;
  let start = 0;
  let end = arr.length;

  while (swapped) {
    swapped = false;

    for (i = start; i < end - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        swapped = true;
        await sleep(5);
        drawLines(arr);
      }
    }

    if (!swapped) {
      break;
    }
    swapped = false;
    end = end - 1;

    for (i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        swapped = true;
        await sleep(5);
        drawLines(arr);
      }
    }
    start = start + 1;
  }
  document.getElementById("mySelect").disabled = false;
  document.getElementById("startButton").disabled = false;
}
