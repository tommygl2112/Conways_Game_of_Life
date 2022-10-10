let btnStart = document.querySelector(".start");
let btnClear = document.querySelector(".clear");
let btnRandom = document.querySelector(".randomize");
let btnRestart= document.querySelector(".restart");
let genCounter = document.querySelector(".gen");
let table = document.querySelector('#table');
let menuPat1 = document.querySelector('#pat1');
let menuPat2 = document.querySelector('#pat2');
let menuPat3 = document.querySelector("#pat3");
let menuPat4 = document.querySelector("#pat4");
let menu = document.querySelector('.patterns');

let xySize = 20; // Height and width of the grid
let htmlArr = []; // HTML grid
let cells = []; // Logical grid
let playing = false;// Flag to check if the game is being played 
let timer; //timer to execute at a particular time
let genNum=0;
function createTable() {

    for (let y = 0; y < xySize; y++) { // Height

        // Generates the <tr></tr> wich there will be the Y coordinate in the HTML grid
        let tr = document.createElement('tr'); // Creates <tr></tr>
        let tdArr = []; // Saves the <td> elements

        cells.push(new Array(xySize).fill(0)); // Creates an array and assigns values to it, the "fill()" method fills specified elements in an array with a value
        htmlArr.push(tdArr); // the "push()" adds new items to the end of an array, in this case the "tdArr"
        table.appendChild(tr); // the "appendChild()" appends a element as the last child of an element, in this case "tr" variable

        for (let x = 0; x < xySize; x++) { // Width

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
    genNum++;//increases the number of generations
    genCounter.innerHTML= "Generation: " + genNum; //refresh the number of generatios each iteration
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
    btnRestart.classList.add("clickDisable"); 
    btnRestart.onclick = () =>reset();
    btnStart.onclick = () => start();
    btnClear.onclick = () => clear();
    btnRandom.onclick = () => randomize();
    menuPat1.onclick = () => loadpat(pattern1);
    menuPat2.onclick = () => loadpat(pattern2);
    menuPat3.onclick = () => loadpat(pattern3);
    menuPat4.onclick = () => loadpat(pattern4);
    menu.classList.add("patternst");
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

//This function is when the button start is clicked - starts and pause the game
function start() {
    btnRestart.classList.remove("clickDisable"); //enables the reset button
    if (playing) {
        playing = false; //if playing equals false the timer will clear and the games stops
        clearTimeout(timer);//sets the timer to 0

        btnStart.innerHTML = 'Resume'; //displays Resume on the button

    } else {
        menu.classList.remove("patternst");
        table.classList.add("pointerDiable");
        genCounter.classList.add("avaible");
        btnRandom.classList.add("clickDisable"); // Adds "clickDisable" class into the "btnRandom" to make it unclickeable and hide it
        menu.classList.add("clikDisable");
        //starts the game 
        btnStart.innerHTML = 'Pause';//displays pause on the button
        
        playing = true;
        play();
    }

}

//This function is to run the game 
function play() {

    //This is used to call the function to generate the generation 
    newGeneration();

    if (playing) {//if playing equals true the game starts playing with an interval of 100
        timer = setTimeout(play, 100); //will call the function play that run the game and execute the new generation
    }
}


//this function is to clear the board
function clear() {
    //we create a nested loop to go throght every cell then remove the ones "filled"[black] and add "empty"[white]
    for (let y = 0; y < xySize; y++) {
        for (let x = 0; x < xySize; x++) {
            document.querySelector(`#coor-${x + "-" + y}`).classList.remove("filled");
            document.querySelector(`#coor-${x + "-" + y}`).classList.add("empty");
            cells[y][x] = 0;
        }
    }
}

function randomize() {
    clear(); // Clears the table
    // Creates random filled cells
    for (let i = 0; i < Math.floor(Math.random() * 400); i++) { // Sets the filled cells quantity randomly between 1 and 400

        let x = Math.floor(Math.random() * xySize); // creates random X coordinate
        let y = Math.floor(Math.random() * xySize); // creates random Y coordinate

        cells[y][x] = 1; // Fills this cell
    }
    draw(); // Updates the visual grid
}
function reset(){ // Set the initial screen
    clearTimeout(timer);
    btnStart.innerHTML = 'Start'; // Change the text in "btnStart" button
    btnRandom.classList.remove("clickDisable"); // Removes the "clickDisable" class on the random button to enable the button again
    btnRestart.classList.add("clickDisable"); // Adds the "clickDisable" class on restart button to set unable
    menu.classList.add("patternst");
    playing = false; // Flag to know that the game stops
    clear(); // Clears the grid
    genNum=0; // Reset the number of generation
    genCounter.classList.remove("avaible");

    table.classList.remove("pointerDiable"); // Set the pointer events enable again
    // Adds the instructions back
    genCounter.innerHTML = `Please set an initial configuration before starts the game by clicking the grid, <br>
    or choosing a pattern in the list.<br>
    <br>
    You can also generate a random initial configuration by clicking the "Randomize" button. <br>
    <br>
    The "Clear" button will wipe all the cells, no matters if the game has started or not.`;
}

let pattern1 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0],
               [0,0,0,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0],
               [0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],       
               [0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0],
               [0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0],
               [0,0,0,0,1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0],
               [0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                ];
let pattern2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],       
               [0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                ];
let pattern3 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],       
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 ];
let pattern4 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],       
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                  ];

function loadpat(pattern){ // Loads the pattern choosen into the grid
    for(let i=0; i<xySize; i++){
        for(let j=0; j<xySize;j++){
            cells[i][j]=pattern[i][j];
        }
    }
        draw();
    }
    
init(); // Initialize the game