import { myFunction, handleHitEnter, handleKeyDown, handleKeyUp } from '/static/eventHandlers.js';
import { render } from '/static/render.js';
import { calculateState } from '/static/calculateState.js';

const canvas = document.getElementById("myCanvas");
const myInput = document.getElementById("myInput");
const panel = document.getElementById('panel');


const paddleHeight = 10;
const paddleWidth = 75;

const canvasHeight = 400;
const canvasWidth = 600;


// State variables, mostly for rendering
const ctx = canvas.getContext("2d");

var statePanel = {
  time: 0
}

var stateBall = {
  x: canvas.width/2,
  y: canvas.height-30,
  r: 10,
  dx: 2,
  dy: -2,
}

var statePaddle = {
  x: (canvas.width-paddleWidth)/2,
  rightPressed: false,
  leftPressed: false,
}

var state = {
  init: false,
  arrBrick: [],
  ball: stateBall,
  panel: statePanel,
  paddle: statePaddle,
}

const updateFrame = ()=> {
  // Actions using state variables on read-only manner
  render(ctx, state);
  calculateState(state);
}



const initialize = (state)=> {
  // The device info will be sent from this function
  console.log('Initialising');
  fetch('/api/initialize', {
    method: 'POST',
  }).then((res)=> {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json();
  }).then((data) => {
    state.arrBrick = data.arrBrick;
  }).catch((e) => {
    console.log(e);
  });
}


// Apply events listeners to elements
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);

// Main actions
document.addEventListener("DOMContentLoaded", function(event) { 
  myInput.addEventListener("input", myFunction);
  // myInput.addEventListener("keydown", handleKeyDownEnter);
  myInput.addEventListener("keyup", handleHitEnter);
  myInput.state = state;

  initialize(state);
  console.log(state);
  setInterval(updateFrame, 50);
});