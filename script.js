"use strict";

const gameGridEl = document.getElementById('game-grid');
const arrowRowEl = document.getElementById('arrow-row');
const playAgainButton = document.getElementById('play-again-button');
const chooseNumPlayersContainer = document.getElementById('choose-num-players-container');
const namePlayersContainer = document.getElementById('name-players-container');

let game;

buildInitialState();
renderInitialState();

//  **************************CHANGE STATE FUNCTIONS*************************************

function buildInitialState() {
    game = {
        numPlayers: 0,
        numThatHaveInputName: 0,
        allNamesFilled: false,
        isPlayer1Turn: false,
        isDraw: false,
        playerHasWon: '',
        finalMoveRendered: false,
        isActualGame: true,
        needToAddPiece: false,
        columnChosen: undefined,

        gridState: [],
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

function addPieceByCoor(row, column, player) {
    addToConnectedPieceSets(game.gridState[row][column], player);
    checkAndAddUnconnected(player);
    findAndPushPairs(row, column, player);
    game.gridState[row][column].contains = 'background-' + game[player].color;
    game[player].allPlacedPieces.push(game.gridState[row][column]);
    // maybe change when this function is called
    updateWinState(player);
    if (player === 'player1') {
        game.isPlayer1Turn = false;
    }
    else {
        game.isPlayer1Turn = true;
    }
}

function addPiece(column) {
    for (let row = 5; row >= 0; row--) {
        if (!game.gridState[row][column].contains) {
            if (game.isPlayer1Turn) {
                addPieceByCoor(row, column, 'player1');
            }
            else {
                addPieceByCoor(row, column, 'player2');
            }
            return true;
        }
    }
    return false;
}

function compTakesTurn() {
    const column = Math.floor(Math.random() * 7);
    if (!game.gridState[0][column].contains) {
        game.columnChosen = column;
        game.needToAddPiece = true;
    }
    else {
        compTakesTurn();
    }
}

function chooseBestMove(moveWeights) {
    let highestWeight = 0;
    let bestMove = Math.floor(Math.random() * 7);
    moveWeights.forEach((weight, index) => {
        if (weight > highestWeight) {
            highestWeight = weight;
            bestMove = index;
        }
    });
    return bestMove;
}

function checkNextTurnWinLose(moveWeights) {
    let actualGame = JSON.parse(JSON.stringify(game));

    // debugger;
    for (let i = 0; i < 7; i++) {
        game.isActualGame = false;
        // if (game.isActualGame) {
        //     debugger;
        // }
        addPiece(i);
        if (game.playerHasWon === 'player2') {
            moveWeights[i] += 100;
        }
        // else {
        //     let testGame = JSON.parse(JSON.stringify(game));
        //     for (let j = 0; j < 7; j++) {
        //         addPiece(j);
        //         if (game.playerHasWon = 'player1') {
        //             moveWeights[i] -= 100;
        //         }
        //         game = testGame;
        //     }
        // }
        game = actualGame;
    }
    // debugger;
    return moveWeights;
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



function updateWinState(player) {
    const numPiecesOnGrid = game.player1.allPlacedPieces.length * 2;
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

// return array of the player's pieces that are touching a given piece
function getTouchingPieces(player, newPiece) {
    const allTouchedPieces = [];
    game[player].allPlacedPieces.forEach(prevPiece => {
        if (thesePiecesAreTouching(newPiece, prevPiece)) {
            allTouchedPieces.push(prevPiece);
        }
    });
    return allTouchedPieces;
}

// returns array containing both the x and y differences between two pieces
function differenceBetween(piece1, piece2) {
    return [piece1.row - piece2.row, piece1.column - piece2.column];
}

// returns true if two given pieces touch
function thesePiecesAreTouching(piece1, piece2) {
    const differences = differenceBetween(piece1, piece2);
    return Math.abs(differences[0]) <= 1 && Math.abs(differences[1]) <= 1;
}

function updateState() {
    if (!game) {
        buildInitialState();
        renderInitialState();
    }
    else if (game.needToAddPiece) {
        if (addPiece(game.columnChosen)) {
            game.needToAddPiece = false;
            game.columnChosen = undefined;
        }
    }
    // else if (game.numPlayers === 1 && game.isActualGame 
    //     && !(game.playerHasWon || game.isDraw) && !isPlayer1Turn) {
    //     compTakesTurn();
    // }
}

//  **************************RENDER FUNCTIONS*************************************

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

// make arrow row
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
    messageEl.id = 'gameEndMessage';
    document.getElementsByTagName('header')[0].children[0].insertAdjacentElement('afterend', messageEl);
    playAgainButton.classList.replace('display-none', 'display-block');
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
    nameInputsContainer.classList.replace('display-block', 'display-none');
    const nameEl = document.createElement('span');
    nameEl.innerText = nameInput;
    nameEl.classList.add(colorClassName);
    playerNameSubContainer.appendChild(nameEl);
    playerNameSubContainer.classList.add('display-flex');
}

// create/replace html elements
function renderInitialState() {
    // empty grid and arrow row elements
    gameGridEl.replaceChildren();
    arrowRowEl.replaceChildren();

    // if there is a game end message remove it
    const gameEndMessage = document.getElementById('gameEndMessage')
    if (gameEndMessage) {
        gameEndMessage.remove();
    }

    // reset naming elements if possible
    namePlayersContainer.classList.replace('display-block', 'display-none');
    chooseNumPlayersContainer.classList.replace('display-none', 'display-flex');

    [...document.getElementsByTagName('span')].forEach(enteredName => enteredName.remove());

    [...document.getElementsByClassName('name-inputs-container')].forEach(nameInputsContainer => nameInputsContainer.classList.replace('display-none', 'display-block'));

    [...document.getElementsByClassName('name-text-input')].forEach(textInput => textInput.value = '');

    // reset play again button if possible
    playAgainButton.classList.replace('display-block', 'display-none');

    // create arrow row
    makeArrows();

    // fill in the game grid
    for (let i = 0; i < 6; i++) {
        renderRow();
    }
}

// render
function renderState() {
    const playerNameSubContainers = namePlayersContainer.children;
    const player1NameEl = playerNameSubContainers[0];
    const player2NameEl = playerNameSubContainers[1];
    const player1SpanEl = player1NameEl.getElementsByTagName('span')[0];
    const player2SpanEl = player2NameEl.getElementsByTagName('span')[0];

    if (game.numPlayers && !game.numThatHaveInputName) {
        namePlayersContainer.classList.replace('display-none', 'display-block');
        chooseNumPlayersContainer.classList.replace('display-flex', 'display-none');
        if (game.numPlayers === 1 && !player2SpanEl) {
            setName(player2NameEl, game.player2.name, 'color-yellow');
        }
    }
    else if (game.numPlayers && !game.allNamesFilled) {
        if (game.player1.name && !player1SpanEl) {
            setName(player1NameEl, game.player1.name, 'color-red');
        }
        if (game.player2.name && !player2SpanEl) {
            setName(player2NameEl, game.player2.name, 'color-yellow');
        }
        if (game.numThatHaveInputName === game.numPlayers) {
            setArrowRowColor();
            game.allNamesFilled = true;
        }
    }
    else if (game.allNamesFilled && !game.finalMoveRendered) {
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
    game.finalMoveRendered = game.playerHasWon || game.isDraw;

    if ((game.playerHasWon || game.isDraw) && game.isActualGame) {
        showWinDraw();
    }
}

//  **************************EVENT HANDLERS*************************************

// maybe a dozen or so helper functions for tiny pieces of the interface
function onBoardClick(event) {
    // update state, maybe with another dozen or so helper functions...
    const clickedEl = event.target;
    const parentClassArray = [...clickedEl.parentElement.classList];
    const classArray = [...clickedEl.classList];
    if (classArray.includes('num-player-button')) {
        numPlayersPress(clickedEl);
    }
    else if (classArray.includes('name-submit')) {
        nameSubmit(event);
    }
    else if (parentClassArray.includes('arrow-down')) {
        arrowClicked(event);
    }
    else if (clickedEl.id === 'play-again-button') {
        game = undefined;
    }
    // if (!(game.playerHasWon === 'player2' && game.numPlayers === 1)) {
    //     renderState();
    //     game.finalMoveRendered = game.playerHasWon || game.isDraw;
    // } 
    updateState();
    renderState();  // show the user the new state
    // game.finalMoveRendered = game.playerHasWon || game.isDraw;   

    if (game.numPlayers === 1 && !game.isPlayer1Turn && game.allNamesFilled && !game.finalMoveRendered) {
        compTakesTurn();
        updateState();
        renderState();
    }
}

// called function when number of players is chosen
function numPlayersPress(clickedEl) {
    if (clickedEl.tagName === 'BUTTON') {
        if (clickedEl.id === 'one-player-button') {
            game.numPlayers = 1;
            game.player2.name = 'Computer';
        }
        else {
            game.numPlayers = 2;
        }
    }
}

function nameSubmit(event) {
    const nameInput = event.target.previousElementSibling.value;
    if (nameInput) {
        if (event.target.parentElement.id === "player1-name-inputs-container") {
            game.player1.name = nameInput;
        }
        else {
            game.player2.name = nameInput;
        }
        game.numThatHaveInputName++;
    }
}

function arrowClicked(event) {
    const column = event.target.dataset.column;
    if (game.allNamesFilled && !game.finalMoveRendered) {
        game.needToAddPiece = true;
        game.columnChosen = column;
    }
}

// event listeners
playAgainButton.addEventListener('click', onBoardClick);
chooseNumPlayersContainer.addEventListener('click', onBoardClick);
namePlayersContainer.addEventListener('click', onBoardClick);
arrowRowEl.addEventListener('click', onBoardClick);