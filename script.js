"use strict";

const gameGridEl = document.getElementsByClassName('game-grid')[0];
const arrowRowEl = document.getElementsByClassName('arrow-row')[0];
const chooseNumPlayersContainer = document.getElementsByClassName('choose-num-players-container')[0];
const namePlayersContainer = document.getElementsByClassName('name-players-container')[0];

let numPlayers = 0;
let hasChosenNumPlayers = false;
let hasEnteredNames = false;

const game = {
    gridState: [[{
        row: 0,
        column: 0,
        contains: 'nothing'
    }]
    ],
    players: {
        player1: {
            name: '',
            addPiece: function (column) {

            }
        },
        player2: {
            name: '',
            addPiece: function (column) {

            }
        },
    },
}

buildInitialState();

// adds a row to the game grid
function makeRow() {
    const newRow = document.createElement('div');
    newRow.classList.add('grid-row', 'display-flex');
    for (let i = 0; i < 7; i++) {
        let gridSpace = document.createElement('div');
        gridSpace.classList.add('grid-space');
        newRow.appendChild(gridSpace);
    }
    gameGridEl.appendChild(newRow);
}

// fill in arrow row
function makeArrows() {
    for (let i = 0; i < 7; i++) {
        const newArrow = document.createElement('div');
        newArrow.className = 'arrow-down';

        const verticalRectangle = document.createElement('div');
        verticalRectangle.className = 'vertical-rectangle';

        const triangleDown = document.createElement('div');
        triangleDown.className = 'triangle-down';

        newArrow.appendChild(verticalRectangle);
        newArrow.appendChild(triangleDown);
        arrowRowEl.appendChild(newArrow);
    }
}

// removes name inputs, creates new element containing provided name
function setName(playerNameContainer, nameInput) {
    const nameInputsContainer = playerNameContainer.getElementsByClassName('name-inputs-container')[0];
    nameInputsContainer.classList.add('display-none');
    const nameEl = document.createElement('span');
    nameEl.innerText = nameInput;
    playerNameContainer.appendChild(nameEl);
    playerNameContainer.classList.add('display-flex');
}

// called function when number of players is chosen
function numPlayersPress(event) {
    const clickedEl = event.target;
    if (clickedEl.tagName === 'BUTTON') {
        if (clickedEl.classList[0] === 'one-player-button') {
            numPlayers = 1;
        }
        else {
            numPlayers = 2;
        }
        hasChosenNumPlayers = true;
        renderState();
    }
}

function buildInitialState() {
    // create arrow row
    makeArrows();

    // fill in the game grid
    for (let i = 0; i < 6; i++) {
        makeRow();
    }
}

function resetState() {
    // reset the game
}

// render
function renderState() {
    if (hasChosenNumPlayers && !hasEnteredNames) {
        namePlayersContainer.classList.replace('display-none', 'display-block');
        chooseNumPlayersContainer.classList.replace('display-flex', 'display-none');
        if (numPlayers === 1) {
            setName(namePlayersContainer.lastElementChild, 'Computer');
        }
    }
    else if (hasEnteredNames) {
        
    }

}

// maybe a dozen or so helper functions for tiny pieces of the interface
function onBoardClick() {
    // update state, maybe with another dozen or so helper functions...

    renderState() // show the user the new state
}

// event listeners
chooseNumPlayersContainer.addEventListener('click', numPlayersPress);