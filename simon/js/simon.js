var gameOn = false,
    gameStarted = false,
    strictGame = false,
    buttonsLocked = false,
    playerStep = 0,
    winningSteps = 20,
    sequence = [],
    RED = 1,
    BLUE = 2,
    YELLOW = 3,
    GREEN = 4,    
    colors = {
      1: {id: RED, name: 'red', sound: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'},
      2: {id:BLUE, name: 'blue', sound: ' https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'},
      3: {id:YELLOW, name: 'yellow', sound: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'},
      4: {id:GREEN, name: 'green', sound: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'}
    },
    errorSound = 'mp3/error.mp3',
    winningAlertInterval;

/**
 * Highlight/unhighlight the last button pressed.
 * @param {object} button - Last button element that was pressed.
 */
function flashButton(button) {
  button.classList.toggle('light');
}

/**
 * Plays the input sound.
 * @param {object} soundSrc - Sound file to play.
 */
function playSound(soundSrc){
    var audio = document.getElementById("audio");

    audio.src = soundSrc;
    audio.play();
}

/**
 * Sets the count field with the input value.
 * @param {number|string} value - Value to display in the count field.
 */
function setCount(value) {
  var countFieldElement = document.getElementById('countField');

  // Make sure value is a string at this point
  value += '';

  countFieldElement.innerHTML = '';
  if (value.length <2 && value < 10) {
    countFieldElement.innerHTML = '0';
  }

  countFieldElement.innerHTML += value;
}

/**
 * Returns the current value in the count field.
 * 
 * @returns Current count value.
 */
function getCount() {
  var countFieldElement = document.getElementById('countField');

  return countFieldElement.innerHTML;
}

/**
 * Randomly creates the next step in the sequence.
 */
function generateStep() {
  var color = Math.floor((Math.random() * 4) + 1),
      colorObj = colors[color],
      colorButtonElement = document.getElementById(colorObj.name + 'Button');

  buttonsLocked = true;

  sequence.push(colorObj.id);

  playSound(colorObj.sound);
  flashButton(colorButtonElement);
  setTimeout(function(colorButtonElement, count) {
    flashButton(colorButtonElement);
    setCount(count);
    buttonsLocked = false;
  }, 500, colorButtonElement, sequence.length);
}

/**
 * Recursively displays the current sequence of button presses to the user.
 * @param {number} i - Index in sequence.
 * @param {any} createNextMove - Flag to generate the next sequence.
 */
function playSequence(i, createNextMove) {
  var value,
      colorButtonElement,
      num = sequence.length;

  buttonsLocked = true;
  if (i >= 0 && i < num) {
    value = sequence[i];
    colorButtonElement = document.getElementById(colors[value].name + 'Button');
    playSound(colors[value].sound);
    flashButton(colorButtonElement);
    setTimeout(function (colorButtonElement, i) {
      flashButton(colorButtonElement);
      setTimeout(function (i) {
        // Show the next step in the sequence
        playSequence(++i, createNextMove);
      }, 500, i);
    }, 500, colorButtonElement, i);
  }
  else {
    // Done displaying all steps in the sequence
    if (createNextMove) {
      setTimeout(function () {
        generateStep();
        buttonsLocked = false;    
      }, 200);      
    }
    else {
      buttonsLocked = false;       
    }
  }
}

/**
 * Event handler for the color button mouse down event.
 * @param {object} evt - Button mouse down event.
 */
function onColorButtonMouseDown(evt) {
  var colorButtonElement = evt.target;

  if (!buttonsLocked) {
    flashButton(colorButtonElement);
  }
}

/**
 * Event handler for the color button mouse up event.
 * @param {object} evt - Button mouse up event.
 */
function onColorButtonMouseUp(evt) {
  var currentCount,
      errorAlertInterval,
      colorButtonElement = evt.target;

  if (!buttonsLocked) {
    flashButton(colorButtonElement);

    if (colorButtonElement.getAttribute('data-color') === colors[sequence[playerStep]].name) {
      // Correct
      playSound(colors[sequence[playerStep]].sound);

      // Last step in the sequence
      if (playerStep === (sequence.length-1)) {
        // Player has won
        if ((playerStep + 1) === winningSteps) {
            setCount('**');
            winningAlertInterval = setInterval(function (colorButtonElement, sound) {
              playSound(sound);
              flashButton(colorButtonElement);
            }, 500, colorButtonElement, colors[sequence[playerStep]].sound); 
            setTimeout(function () {
              clearInterval(winningAlertInterval);
            }, 4000) 
        }
        else {
          // Create the next sequence
          setTimeout(function () {
              playerStep = 0;
              playSequence(0, true);            
          }, 1000);          
        }
      }
      else {
        playerStep++;        
      }
    }
    else {
      // Error
      currentCount = getCount();

      errorAlertInterval = setInterval(function (colorButtonElement, errorSound) {
        playSound(errorSound);
        setCount('!!');
      }, 300, colorButtonElement, errorSound); 
      setTimeout(function () {
        clearInterval(errorAlertInterval);

        if (strictGame) {
          newGame();
        }
        else {
          setTimeout(function (currentCount) {
            setCount(currentCount);

            setTimeout(function () {
              playerStep = 0;
              playSequence(0, false);
            }, 400);
          }, 400, currentCount);      
        }
      }, 3000) 

    }
  }
}

/**
 * Starts a new game.
 */
function newGame() {
  if (gameOn) {
    sequence = [];

    playerStep = 0;
    gameStarted = true;
    generateStep();      
  }
}

/**
 * Event handler for the start button.
 * @param {object} evt - Button click event.
 */
function onStartGame(evt) {
  if (gameOn) {
    newGame();    
  }
}

/**
 * Event handler for the strict mode button.
 * @param {object} evt - Button click event.
 */
function onStrictGame(evt) {
  var strictGameLightElement;
  
  if (gameOn) {
    strictGameLightElement = document.getElementById('strictGameLight');
    strictGameLightElement.classList.toggle('strict-mode-on');
    if (strictGame) {
      strictGame = false;              
    }
    else {
      strictGame = true;
    }
  }
}

/**
 * Initializes event handlers for the game buttons.
 */
function initListeners() {
  var colorButtons,
      startButtonElement = document.getElementById('startButton'),
      strictButtonElement = document.getElementById('strictButton');

  if (gameOn) {
    startButtonElement.onclick = onStartGame;
    strictButtonElement.onclick = onStrictGame;

    colorButtons = document.getElementsByClassName('colorButton');
    for (i = 0, num = colorButtons.length; i < num; i++) {
      colorButton = colorButtons[i];
      colorButton.onmousedown = onColorButtonMouseDown;
      colorButton.onmouseup = onColorButtonMouseUp;
    }
  }
  else {
    startButtonElement.onclick = null;
  }
}

/**
 * Event handler for the power switch button.
 * @param {object} evt - Button click event.
 */
function onPowerSwitchClick(evt) {
  var countFieldElement = document.getElementById('countField'),
      powerSwitchElement = evt.target;
  powerSwitchElement.classList.toggle('gameOn');

  if (powerSwitchElement.classList.contains('gameOn')) {
    gameOn = true;
  }
  else {
    gameOn = false;
    countFieldElement.innerHTML = '--';
  }
  countFieldElement.classList.toggle('count-off');

  initListeners();
}

var powerSwitchElement = document.getElementById('powerSwitch');
powerSwitchElement.onclick = onPowerSwitchClick;

