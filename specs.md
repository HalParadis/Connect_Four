As users playing a two player game we want to:

[X]    enter our names and have them displayed
[X]    have our order chosen for us by the game
[X]    take turns by dropping our chip into a column on the grid
[X]    not be able to drop a chip into a totally filled column
[X]    be told when a move causes a player to win, or to draw
[X]    start the game over without having to reset the browser

As a user playing a single player game I additionally want to:

[X]    see the name 'Computer' displayed as my opponent
[X]    have the Computer player choose columns as if it were a human player

As a user playing a single player game I would be delighted if:

[ ]    the Computer chooses the correct column for a win, when possible




compTakesTurn comments:
    // const actualGame = JSON.parse(JSON.stringify(game));
    // const moveWeights = [0, 0, 0, 0, 0, 0, 0];
    // for (let i = 0; i < 3; i++) {
    //     moveWeights = checkNextTurnWinLose(moveWeights);
    //     addPiece(chooseBestMove(moveWeights));
    //     for (let j = 0; j < 7; j++) {

    //     }
    // }
    // game = actualGame;

    // let moveWeights = [0, 0, 0, 0, 0, 0, 0];
    // moveWeights = checkNextTurnWinLose(moveWeights);
    // let hasAddedPiece = false;
    // while (!hasAddedPiece) {
    //     if (addPiece(chooseBestMove(moveWeights))) {
    //         hasAddedPiece = true;
    //         renderState();
    //         game.finalMoveRendered = game.playerHasWon || game.isDraw;
    //     }
    // }

    // let moveWeights = [0, 0, 0, 0, 0, 0, 0];
    // moveWeights = checkNextTurnWinLose(moveWeights);
    // console.log('moveWeights:');
    // console.log(moveWeights);

addPiece comments:
    // if (game.numPlayers === 1 && game.isActualGame && !(game.playerHasWon || game.isDraw)) {
    //     compTakesTurn();
    // }

renderState comments:
        // this is probably not the right place for this, I don't think it should be in this function 
        // should probably go in onBoardClick
        // if (game.numPlayers === 1 && !game.isPlayer1Turn) {
        //     compTakesTurn();
        // }