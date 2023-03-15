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
    isDraw: false,
    playerHasWon: '',

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
        allPlacedPieces: [],
        notConnectedPieces: [],
        connectedPieceSets: [],
    },
    player2: {
        name: '',
        color: 'color-yellow',
        allPlacedPieces: [],
        notConnectedPieces: [],
        connectedPieceSets: [],
    },
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

function addPiece(column) {
    for (let row = 5; row >= 0; row--) {
        if (!game.gridState[row][column].contains) {
            if (game.isPlayer1Turn) {
                addToConnectedPieceSets(game.gridState[row][column], 'player1');    
                checkAndAddUnconnected('player1');
                findAndPushPairs(row, column, 'player1');      
                game.gridState[row][column].contains = 'background-' + game.player1.color;
                game.player1.allPlacedPieces.push(game.gridState[row][column]);
                game.isPlayer1Turn = false;
                updateWinState('player1');
                if (game.numPlayers === 1) {
                    compTakesTurn();
                }
            }
            else {      
                addToConnectedPieceSets(game.gridState[row][column], 'player2');
                checkAndAddUnconnected('player2');
                findAndPushPairs(row, column, 'player2');           
                game.gridState[row][column].contains = 'background-' + game.player2.color;
                game.player2.allPlacedPieces.push(game.gridState[row][column]);
                game.isPlayer1Turn = true;
                updateWinState('player2');
            }
            return true;
        }
    }
    return false;
}

function findAndPushPairs(row, column, player) {
    const touchingPieces = getTouchingPieces(player, game.gridState[row][column]);
    if (touchingPieces.length > 0) {
        touchingPieces.forEach(piece => {
            const newPair = [piece, game.gridState[row][column]];
            game[player].connectedPieceSets.push(newPair);
        });
    }
    else {
        game[player].notConnectedPieces.push(game.gridState[row][column]);
    } 
}

function addToConnectedPieceSets(piece, player) {
    game[player].connectedPieceSets.forEach(set => {
        if (isInLineWith(piece, set) && !isInSetOfPieces(piece, set)) {
            set.push(piece);
        }
    });
}

function checkAndAddUnconnected(player) {
    game[player].notConnectedPieces.forEach(piece => {
        addToConnectedPieceSets(piece, player);
    });
}

// maybe can make DRYer with ternary operator, assigning return to inArr
function isInSetOfPieces(newPiece, setOfPieces) {
    let isInSet = false;
    setOfPieces.forEach(prevPiece => {
        if (newPiece.row === prevPiece.row && newPiece.column === prevPiece.column) {
            isInSet = true;
        }
    });
    return isInSet;
}


function compTakesTurn() {

}

function updateWinState(player) {
    const numPiecesOnGrid = game.player1.allPlacedPieces.length + game.player1.allPlacedPieces.length;
    game[player].connectedPieceSets.forEach(set => {
        if (set.length >= 4) {
            game.playerHasWon = player;
        }
    });
    if (!game[player].hasWon && numPiecesOnGrid === 42) {
        game.isDraw = true;
    }
}

// checks if the difference between the first two pieces in connectedPieces matches the difference between the 
// new piece and any of the pieces in connectedPieces
function isInLineWith(newPiece, connectedPieces) {
    const prevDiffs = differenceBetween(connectedPieces[0], connectedPieces[1]);
    let isInLine = false;

    connectedPieces.forEach(prevPiece => {
        const newDiffs = differenceBetween(newPiece, prevPiece);
        if ((newDiffs[0] === prevDiffs[0] && newDiffs[1] === prevDiffs[1]) || 
        (newDiffs[0] === -1 * prevDiffs[0] && newDiffs[1] === -1 * prevDiffs[1])) {
            isInLine = true;
        }
    });
    return isInLine;
}

function getTouchingPieces(player, newPiece) {
    const allTouchedPieces = [];
    game[player].allPlacedPieces.forEach(prevPiece => {
        if (thesePiecesAreTouching(newPiece, prevPiece)) {
            allTouchedPieces.push(prevPiece);
        }
    });
    return allTouchedPieces;
}

function differenceBetween(piece1, piece2) {
    return [piece1.row - piece2.row, piece1.column - piece2.column];
}

function thesePiecesAreTouching(piece1, piece2) {
    const differences = differenceBetween(piece1, piece2);
    return Math.abs(differences[0]) <= 1 && Math.abs(differences[1]) <= 1;
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
            // this is probably not the right place for this, I don't think it should be in this function 
            // should probably go in onBoardClick
            if (game.numPlayers === 1 && !game.isPlayer1Turn) {
                compTakesTurn();
            }
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
    
    if (game.playerHasWon || game.isDraw) {
        showWinDraw();
    }
}

function showWinDraw() {
    const messageEl = document.createElement('h2');
    let message;
    if (game.playerHasWon) {
        message = `${game[game.playerHasWon].name} Wins`;
    }
    else {
        message = 'The game is a Draw';
    }
    messageEl.innerText = message;
    document.getElementsByTagName('header')[0].appendChild(messageEl);
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
            if (colorToReplace) {
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
    const prevSibling = event.target.previousElementSibling;
    if (prevSibling) {
        const nameInput = prevSibling.value;
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
}

function arrowClicked(event) {
    const column = event.target.dataset.column;
    if (column !== undefined && game.allNamesFilled) {
        if (addPiece(column)) {
            renderState();
        }
    }
}

// event listeners
chooseNumPlayersContainer.addEventListener('click', numPlayersPress);
namePlayersContainer.addEventListener('click', nameSubmit);
arrowRowEl.addEventListener('click', arrowClicked);