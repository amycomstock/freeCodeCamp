var X = 'X',
    O = 'O',
    computerPlayer = O,
    realPlayer = X,
    currentPlayer = realPlayer,
    gameBoard = {
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
      8: '',
      9: ''
    },
    winningCombos = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7]
    ],
    squareElements = document.getElementsByClassName('square'),
    statusElement = document.getElementById('status');

function restartGame(status) {
  statusElement.innerHTML = status;
  setTimeout(function () {
    resetGameBoard();
  }, 7000);
}

function resetGameBoard() {
  var i,
      squareElement,
      numSquares = Object.keys(gameBoard).length;

  for (i = 1; i <= numSquares; i++) {
    gameBoard[i] = '';
    
    squareElement = document.getElementById(i);
    squareElement.onclick = null;
    squareElement.innerHTML = '';

    statusElement.innerHTML = '';
  }
}

function isDraw() {
  var key;

  for (key in gameBoard) {
    if (gameBoard.hasOwnProperty(key)) {
      if (gameBoard[key] === '') {
        return false;        
      }
    }
  }

  return true; 
}

function won() {
  // TO DO:
  // Loop through winning combos
  // get game board values for each
  // if any are the same, current player has won
  // Also, if all pieces are filled game is a draw
  var i,
      winningCombo,
      value1,
      value2,
      value3,
      results = {},
      num = winningCombos.length;

  for (i = 0; i < num; i++) {
    winningCombo = winningCombos[i];

    value1 = gameBoard[winningCombo[0]];
    value2 = gameBoard[winningCombo[1]];
    value3 = gameBoard[winningCombo[2]];

    if (value1 && value2 && value3) {
      if (value1 === value2 && value1 === value3) {
        results.won = true;
        results.winningPlayer = value1;
        return results;
      }      
    }
  }

  results.won = false;
  results.winningPlayer = null;
  return results;
}

function makeComputerMove() {
  var squareElement,
      squareId = Math.floor((Math.random() * 9) + 1);
      
  if (gameBoard[squareId].length === 0) {
    squareElement = document.getElementById(squareId);
    squareElement.innerHTML = computerPlayer;
    gameBoard[squareId] = computerPlayer;
    results = won();
    if (results.won) {
      restartGame('Player ' + results.winningPlayer + ' has won!');
    }
    else {
      statusElement.innerHTML = 'Your turn!';      
    }
    return;
  }
  else {
    makeComputerMove();
  }
}

function makeMove(evt) {
  var squareElement = evt.target,
      squareId = squareElement.id;

  if (!squareElement.innerHTML.length) {
    squareElement.innerHTML = currentPlayer;    
  }
  else {
    if (isDraw()) {
      restartGame('Sorry, game is a draw.');
    }
    else {
      alert('Sorry, that square is already filled. Please select an empty square.');      
    }
  }

  gameBoard[squareId] = currentPlayer;  

  results = won();
  if (!results.won) {
    if (isDraw()) {
      restartGame('Sorry, game is a draw.');
    }
    else {
      if (currentPlayer === computerPlayer) { // Computer player switch to real
        currentPlayer = realPlayer;
        statusElement.innerHTML = 'Your turn!';
      }
      else { // Real player switch to computer
        statusElement.innerHTML = 'Computer\'s turn!';
        setTimeout(makeComputerMove, 3000);
      }      
    }
  }
  else {
    restartGame('Player ' + results.winningPlayer + ' has won!');
  }
}


function initListeners() {
  var i,
      num,
      squareElement,
      squareElements = document.getElementsByClassName('square');

  for (i = 0, num = squareElements.length; i < num; i++) {
    squareElement = squareElements[i];
    squareElement.innerHTML = '';

    squareElement.onclick = makeMove;
  }

}

function startGame() {
  initListeners();
  statusElement.innerHTML = 'Your turn!';

  realPlayer = document.querySelector('input[name="playerSymbol"]:checked').value;
  currentPlayer = realPlayer;
  if (realPlayer === O) {
    computerPlayer = X;
  }
  else {
    computerPlayer = O;
  }
}

startButtonElement = document.getElementById('startButton');
startButtonElement.onclick = startGame;

resetGameBoard();

