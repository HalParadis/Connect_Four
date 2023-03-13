"use strict";

const gameGridEl = document.getElementById('game-grid');
const arrowRowEl = document.getElementById('arrow-row');
const chooseNumPlayersContainer = document.getElementById('choose-num-players-container');
const namePlayersContainer = document.getElementById('name-players-container');

const game = {
    numPlayers: 0,
    numThatHaveInputName: 0,
    allNamesFilled: false,

    isPlayer1Turn: false,

    gridState: [
        // {
        // row: j,
        // column: i,
        // contains: ''
        // }
    ],
    player1: {
        name: '',
        color: 'color-red',
    },
    player2: {
        name: '',
        color: 'color-yellow',
    },
    addPiece: function (column) {
        let colorToAdd = '';

        if (this.isPlayer1Turn) {
            colorToAdd = this.player1.color;
        }
        else {
            colorToAdd = this.player2.color;
        }
        colorToAdd = 'background-' + colorToAdd;

        for (let i = 5; i >= 0; i--) {
            if (!this.gridState[i][column].contains) {
                this.gridState[i][column].contains = colorToAdd;
                if (this.isPlayer1Turn) {
                    this.isPlayer1Turn = false;
                }
                else {
                    this.isPlayer1Turn = true;
                }
                return true;
            }
        }
        return false;
    }
}

buildInitialState();
renderInitialState();

// adds a row to the game grid html
function renderRow() {
    const newRow = document.createElement('div');
    newRow.classList.add('grid-row', 'display-flex');
    for (let i = 0; i < 7; i++) {
        let gridSpace = document.createElement('div');
        gridSpace.classList.add('grid-space', 'background-color-white');
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
        verticalRectangle.dataset.column = i;

        const triangleDown = document.createElement('div');
        triangleDown.className = 'triangle-down';
        triangleDown.dataset.column = i;

        newArrow.appendChild(verticalRectangle);
        newArrow.appendChild(triangleDown);
        arrowRowEl.appendChild(newArrow);
    }
}

function buildInitialState() {
    for (let j = 0; j < 6; j++) {
        const newRow = [];
        for (let i = 0; i < 7; i++) {
            newRow.push({
                row: j,
                column: i,
                contains: ''
            });
        }
        game.gridState.push(newRow);
    }

    if (Math.floor(Math.random() * 2) === 0) {
        game.isPlayer1Turn = true;
    }
}

// create html elements
function renderInitialState() {
    // create arrow row
    makeArrows();

    // fill in the game grid
    for (let i = 0; i < 6; i++) {
        renderRow();
    }
}

function resetState() {
    // reset the game
}

// maybe a dozen or so helper functions for tiny pieces of the interface
function onBoardClick() {
    // update state, maybe with another dozen or so helper functions...

    renderState() // show the user the new state
}

// render
function renderState() {
    if (game.numPlayers && !game.numThatHaveInputName) {
        namePlayersContainer.classList.replace('display-none', 'display-block');
        chooseNumPlayersContainer.classList.replace('display-flex', 'display-none');
        if (game.numPlayers === 1) {
            setName(namePlayersContainer.lastElementChild, game.player2.name, 'color-yellow');
        }
    }
    else if (!game.allNamesFilled) {
        const playerNameSubContainers = namePlayersContainer.children;
        if (game.player1.name && !playerNameSubContainers[0].getElementsByTagName('span')[0]) {
            setName(playerNameSubContainers[0], game.player1.name, 'color-red');
        }
        if (game.player2.name && !playerNameSubContainers[1].getElementsByTagName('span')[0]) {
            setName(playerNameSubContainers[1], game.player2.name, 'color-yellow');
        }
        if (game.numThatHaveInputName === game.numPlayers) {
            setArrowRowColor();
            game.allNamesFilled = true;
        }
    }
    else {
        setArrowRowColor();
        for (let row = 0; row < 6; row++) {
            let rowEl = gameGridEl.children[row];
            for (let column = 0; column < 7; column++) {
                let gridSpace = rowEl.children[column];
                if (game.gridState[row][column].contains) {
                    gridSpace.classList.replace('background-color-white', game.gridState[row][column].contains);
                }
            }
        }
    }

}

// needs more work to make DRY
function setArrowRowColor() {
    let colorClassName = '';
    let oldColorClassName = '';

    if (game.isPlayer1Turn) {
        colorClassName = game.player1.color;
        oldColorClassName = game.player2.color;
    }
    else {
        colorClassName = game.player2.color;
        oldColorClassName = game.player1.color;
    }

    if (game.allNamesFilled) {
        setArrowRowColorTo(colorClassName, oldColorClassName)
    }
    else {
        setArrowRowColorTo(colorClassName);
    }   
}

function setArrowRowColorTo(newColor, colorToReplace) {
    [...arrowRowEl.children].forEach(arrow => {
        [...arrow.children].forEach(component => {
            if (colorToReplace){
                component.classList.replace(colorToReplace, newColor);
            }
            else {
                component.classList.add(newColor);
            }
        });
    });    
}

// removes name inputs, creates new element containing provided name
function setName(playerNameSubContainer, nameInput, colorClassName) {
    const nameInputsContainer = playerNameSubContainer.getElementsByClassName('name-inputs-container')[0];
    nameInputsContainer.classList.add('display-none');
    const nameEl = document.createElement('span');
    nameEl.innerText = nameInput;
    nameEl.classList.add(colorClassName);
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
    let nameInput = event.target.previousElementSibling.value;
    if ([...event.target.classList].includes('name-submit') && nameInput) {
        if (event.target.parentElement.id === "player1-name-inputs-container") {
            game.player1.name = nameInput;
        }
        else {
            game.player2.name = nameInput;
        }
        game.numThatHaveInputName++;
        renderState();
    }
}

function arrowClicked(event) {
    const column = event.target.dataset.column;
    if (column !== undefined) {
        if (game.addPiece(column)) {
            renderState();
        }
    }
}

    // event listeners
    chooseNumPlayersContainer.addEventListener('click', numPlayersPress);
    namePlayersContainer.addEventListener('click', nameSubmit);
    arrowRowEl.addEventListener('click', arrowClicked);