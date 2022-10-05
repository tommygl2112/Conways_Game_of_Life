let xySize = 20; // Height and width of the grid
let htmlArr = []; // HTML grid
let cells = []; // Logical grid

function createTable() {
    let table = document.querySelector('#table'); // Gets the <table> from the HTML whit the "id=field"

    for (let y = 0; y < xySize; y++) { // Height

        // Generates the <tr></tr> wich there will be the Y coordinate in the HTML grid
        let tr = document.createElement('tr'); // Creates <tr></tr>
        let tdArr = []; // Saves the <td> elements

        cells.push(new Array(xySize).fill(0)); // Creates an array and assigns values to it, the "fill()" method fills specified elements in an array with a value
        htmlArr.push(tdArr); // the "push()" adds new items to the end of an array, in this case the "tdArr"
        table.appendChild(tr); // the "appendChild()" appends a element as the last child of an element, in this case "tr" variable

        for (let x = 0; x <xySize; x++) { // Width

            // Generates the <td></td> with an "id" and "onmouseup" function, then append it in the respective <tr></tr>
            let td = document.createElement('td'); // Creates <td></td>
            td.setAttribute("id", `coor-${x + "-" + y}`); // Adds an id to the <td> which will be a position with respect to a coordinate
            td.setAttribute("onmouseup", `search(${x},${y})`); // Adds an onmouseup function to the <td>
            tdArr.push(td); // Saves the <td> into the "tdArr" array
            tr.appendChild(td); // The appendChild() method appends a element as the last child of an element
        }
    }
}

function draw() {
    for (let y = 0; y < xySize; y++) { // Height

        for (let x = 0; x < xySize; x++) { // Width

            // The "setAttribute()" method sets a new value to an attribute
            // Sets to the grid cell a color adding a class to the <td> according to the "cells[y][x]" value
            // 1 = Filled = black
            // 0 = Empty = white
            htmlArr[y][x].setAttribute('class', 'cell ' + (cells[y][x] === 1 ? 'filled' : 'empty'));
        }
    }
}

function newGeneration() {
    let newCells = []; // Save the new logical grid

    for (let y = 0; y < xySize; y++) { // Temporal logical grid

        newCells.push(new Array(xySize).fill(0));  // Creates an array and assigns values to it, the "fill()" method fills specified elements in an array with a value
        
    }

    for (let y = 0; y < xySize; y++) { // Height

        for (let x = 0; x < xySize; x++) { // Width

            let neibhours = neighboursCount(x, y); // Search for neighbours arround the cell

            if (cells[y][x] === 0 && neibhours === 3) { // if the cell is empty and has 3 neighbours
                newCells[y][x] = 1; // Fills the cell
            }

            if (cells[y][x] === 1 && (neibhours === 2 || neibhours === 3)) { // if the cell is filled and has 3 or 2 neighbours
                newCells[y][x] = 1; // The cell stays
            }
        }
    }
    cells = newCells; // Updates the logical grid
    draw(); // Updates the visual grid
}

function neighboursCount(x, y) {
    let count = 0;
    
    // Get over though the total neighbourhood next to the central cell (0,0)
    for (h = -1; h <= 1; h++) { // Y -1 to Y + 1
        
        for (w = -1; w <= 1; w++) { // X - 1 to X + 1
            
            let nx = (x + w + xySize) % xySize;
            let ny = (y + h + xySize) % xySize;

            count = count + cells[ny][nx];
        }
    }

    return count - cells[y][x]; // return the total neighbours minus the input cell
}

function init() { // Initialize the game
    createTable();
    draw();
}

function search(x, y) { // Search for the <td> with the "id" (id = coordinate)

    // Black to white
    if (document.querySelector(`#coor-${x + "-" + y}`).classList[1] === "filled") { //Check if the <td> has the "filled" class
        document.querySelector(`#coor-${x + "-" + y}`).classList.remove("filled"); // Remove the "filled" class in the <td>
        document.querySelector(`#coor-${x + "-" + y}`).classList.add("empty"); // Add the "empty" class in the <td>
        cells[y][x] = 0; // Change the cell value
    }

    // White to black
    else {
        document.querySelector(`#coor-${x + "-" + y}`).classList.remove("empty"); //Remove the "empty" class in the <td>
        document.querySelector(`#coor-${x + "-" + y}`).classList.add("filled"); // Add the "filled" class in the <td>
        cells[y][x] = 1;
    }
}

init(); // Initialize the game