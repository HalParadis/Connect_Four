"use strict";

const gameGridEl = document.getElementById('game-grid');
const arrowRowEl = document.getElementById('arrow-row');
// const onePlayerButton = document.getElementById('one-player-button');
// const twoPlayerButton = document.getElementById('two-player-button');
const chooseNumPlayers = document.getElementById('choose-num-players');
const namePlayers = document.getElementById('name-players');

let numPlayers = 0;
let gameInProgress = false;

const gameGrid = {
    gameState: [],
    addPiece: function(color, column) {

    }
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

function numPlayersPress(event) {
    const clickedEl = event.target;
    if (clickedEl.tagName === 'BUTTON') {
        if (clickedEl.id === 'one-player-button') {
            numPlayers = 1;
        }
        else {
            numPlayers = 2;
        }
        
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

// render
function renderState() {
    if (namePlayers.style.display !== 'block') {
        namePlayers.style.display = 'block';
        chooseNumPlayers.style.display = 'none';
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