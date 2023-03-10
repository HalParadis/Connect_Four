"use strict";

const gameGridEl = document.getElementsByClassName('game-grid')[0];
const arrowRowEl = document.getElementsByClassName('arrow-row')[0];
const chooseNumPlayers = document.getElementsByClassName('choose-num-players')[0];
const namePlayers = document.getElementsByClassName('name-players')[0];

let numPlayers = 0;
let hasChosenNumPlayers = false;
let gameInProgress = false;

const game = {
    gridState: [],
    players: {
        player1: {
            name: '',
            addPiece: function(column) {
    
            }
        },
        player2: {
            name: '',
            addPiece: function(column) {
    
            }
        },
    },
}

buildInitialState();

function makeRow() {
    const newRow = document.createElement('tr');
    for (let i = 0; i < 7; i++) {
        newRow.appendChild(document.createElement('td'));
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

function setName(playerEl, nameInput) {
    const nameInputs = playerEl.getElementsByClassName('name-inputs')[0];
    nameInputs.classList.add('display-none');
    playerEl.appendChild();
}

function numPlayersPress(event) {
    const clickedEl = event.target;
    if (clickedEl.tagName === 'BUTTON') {
        if (clickedEl.className === 'one-player-button') {
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
    if (hasChosenNumPlayers && !gameInProgress) {
        namePlayers.classList.replace('display-none', 'display-block');
        chooseNumPlayers.classList.replace('display-flex', 'display-none');
        if (numPlayers === 1) {

        }
    }


}

// maybe a dozen or so helper functions for tiny pieces of the interface
function onBoardClick() {
  // update state, maybe with another dozen or so helper functions...

  renderState() // show the user the new state
}

// event listeners
chooseNumPlayers.addEventListener('click', numPlayersPress);