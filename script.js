"use strict";

const gameGridEl = document.getElementById('game-grid');
const arrowRowEl = document.getElementById('arrow-row');
const chooseNumPlayersContainer = document.getElementById('choose-num-players-container');
const namePlayersContainer = document.getElementById('name-players-container');

const game = {
    numPlayers: 0,
    numThatHaveInputName: 0,
    allNamesFilled: false,
    gridState: [[{
        row: 0,
        column: 0,
        contains: 'nothing'
    }]
    ],
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
}

initialRender();

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
function setName(playerNameSubContainer, nameInput) {
    const nameInputsContainer = playerNameSubContainer.getElementsByClassName('name-inputs-container')[0];
    nameInputsContainer.classList.add('display-none');
    const nameEl = document.createElement('span');
    nameEl.innerText = nameInput;
    playerNameSubContainer.appendChild(nameEl);
    playerNameSubContainer.classList.add('display-flex');
}

// called function when number of players is chosen
function numPlayersPress(event) {
    const clickedEl = event.target;
    if (clickedEl.tagName === 'BUTTON') {
        if (clickedEl.id === 'one-player-button') {
            game.numPlayers = 1;
            game.player2.name = 'Computer';
        }
        else {
            game.numPlayers = 2;
        }
        renderState();
    }
}

function nameSubmit(event) {
    if ([...event.target.classList].includes('name-submit')) {
        game.numThatHaveInputName++;
        if (event.target.parentElement.id === "player1-name-inputs-container") {
            game.player1.name = event.target.previousElementSibling.value;
        }
        else {
            game.player2.name = event.target.previousElementSibling.value;
        }
        renderState();
    }
}

function initialRender() {
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
    if (game.numPlayers && !game.numThatHaveInputName) {
        namePlayersContainer.classList.replace('display-none', 'display-block');
        chooseNumPlayersContainer.classList.replace('display-flex', 'display-none');
        if (game.numPlayers === 1) {
            setName(namePlayersContainer.lastElementChild, game.player2.name);
        }
    }
    else if (!game.allNamesFilled) {
        const playerNameSubContainers = namePlayersContainer.children;
        if (game.player1.name && !playerNameSubContainers[0].getElementsByTagName('span')[0]) {
            setName(playerNameSubContainers[0], game.player1.name);
        }
        if (game.player2.name && !playerNameSubContainers[1].getElementsByTagName('span')[0]) {
            setName(playerNameSubContainers[1], game.player2.name);
        }
        if (game.numThatHaveInputName === game.numPlayers) {
            game.allNamesFilled = true;
        }
    }

}

// maybe a dozen or so helper functions for tiny pieces of the interface
function onBoardClick() {
    // update state, maybe with another dozen or so helper functions...

    renderState() // show the user the new state
}

// event listeners
chooseNumPlayersContainer.addEventListener('click', numPlayersPress);
namePlayersContainer.addEventListener('click', nameSubmit);