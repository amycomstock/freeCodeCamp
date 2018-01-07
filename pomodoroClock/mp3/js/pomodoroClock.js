var countdownTimer,
    progressBar,
    DEFAULT_WORK_TIME = 1500, // 25 minutes
    currentWorkTime = DEFAULT_WORK_TIME,
    DEFAULT_BREAK_TIME = 300, // 5 minutes
    DEFAULT_WORK_TIME = 1500, // 25 minutes
    currentWorkTime = DEFAULT_WORK_TIME,
    time = currentWorkTime,
    clockProgressElement = document.getElementById('clockProgress'),
    sessionTypeElement = document.getElementById('sessionType'),
    countdownElement = document.getElementById('countdown'),
    breakInputElement = document.getElementById('breakInput'),
    workInputElement = document.getElementById('workInput');

/**
 * Initializes the progress bar on the outer edge
 * of the clock using the third party ProgressBar.js file.
 * 
 * @param {number} time 
 */
function initProgressBar(time) {
  progressBar = new ProgressBar.Circle(document.getElementById('clockProgress'), {
    strokeWidth: 10,
    easing: 'easeInOut',
    duration: time * 1000,
    color: '#aa0000',
    trailColor: '#FFCCCC',
    trailWidth: 10,
    svgStyle: null
  });

  progressBar.animate(1.0);  // Number from 0.0 to 1.0  
}

/**
 * Stops the progress bar.
 * 
 */
function stopProgressBar() {
  progressBar._opts.duration = 0;

  removeProgressBar();
}

/**
 * Removes the progress bar element from the dom.
 * 
 */
function removeProgressBar() {
  var progressBarElement = document.getElementsByTagName('svg')[0];

  if (progressBarElement) {
    clockProgressElement.removeChild(progressBarElement);
  }
}

/**
 * Formats a number into a time string.
 * 
 * @param {number} value 
 * @returns string
 */
function formatTime(value) {
  var value_mod_3600 = value % 3600,
      hours = Math.floor(value / 3600),
      minutes = Math.floor(value_mod_3600 / 60),
      seconds = Math.floor(value_mod_3600 % 60);

  return ((hours > 0 ? hour + ":" + (minutes < 10 ? "0" : "") : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);   
}

/**
 * Updates the clock time.
 * 
 */
function updateTime() {
  var progressBarElement;

  time--;

  if (time < 0) {
    if (sessionTypeElement.innerHTML.indexOf('Work') > -1 ) {
      sessionTypeElement.innerHTML = 'Break';
      sessionTypeElement.style.color = 'blue';
      time = breakInputElement.value;
    }
    else {
      sessionTypeElement.innerHTML = 'Work';
      sessionTypeElement.style.color = 'green';
      time = workInputElement.value;
    }

    time *= 60;

    document.getElementById('sound').play();

    progressBarElement = document.getElementsByTagName('svg')[0];
    if (progressBarElement) {
      clockProgressElement.removeChild(progressBarElement);
      initProgressBar(time);
    }
  }
  countdownElement.innerHTML = formatTime(time);
}

/**
 * Event handler for the start button.
 * 
 * @param {object} evt 
 */
function onStartButtonClick(evt) {
  countdownTimer = setInterval(updateTime, 1000);
  breakInputElement.disabled = true;
  workInputElement.disabled = true;

  initProgressBar(time);
}

/**
 * Event handler for the stop button.
 * 
 * @param {object} evt 
 */
function onStopButtonClick(evt) {
  clearInterval(countdownTimer);
  countdownTimer = null;
  breakInputElement.disabled = '';
  workInputElement.disabled = '';

  stopProgressBar();
}

/**
 * Event handler for the reset button.
 * 
 * @param {object} evt 
 */
function onResetButtonClick(evt) {
  clearInterval(countdownTimer);
  countdownTimer = null;
  sessionTypeElement.innerHTML = 'Work';
  time = currentWorkTime;
  countdownElement.innerHTML = formatTime(time);
  breakInputElement.disabled = '';
  workInputElement.disabled = '';

  removeProgressBar();
}

/**
 * Event handler for the break input field.
 * 
 * @param {object} evt 
 */
function onBreakInputChange(evt) {
  if (!countdownTimer) {
    time = evt.target.value * 60;
    countdownElement.innerHTML = formatTime(time);
  }
}

/**
 * Event handler for the work input field.
 * 
 * @param {object} evt 
 */
function onWorkInputChange(evt) {
  if (!countdownTimer) {
    currentWorkTime = evt.target.value * 60;
    time = currentWorkTime;
    countdownElement.innerHTML = formatTime(currentWorkTime);
  }
}

/**
 * Initializes the event handlers for the form fields.
 * 
 */
function initListeners() {
  var startButtonElement = document.getElementById('startButton'),
      stopButtonElement = document.getElementById('stopButton'),
      resetButtonElement = document.getElementById('resetButton');

  startButtonElement.onclick = onStartButtonClick;
  stopButtonElement.onclick = onStopButtonClick;
  resetButtonElement.onclick = onResetButtonClick;
  breakInputElement.onchange = onBreakInputChange;
  workInputElement.onchange = onWorkInputChange;
}

/**
 * Initializes the pomodoro clock.
 * 
 */
function init() {
  initListeners();
  countdownElement.innerHTML = formatTime(currentWorkTime);
}

init();