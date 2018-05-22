import { Renderer } from '/static/render.js';
import { StateCalculator } from '/static/calculateState.js';

const canvas = document.getElementById("myCanvas");
const myInput = document.getElementById("myInput");
const panel = document.getElementById('panel');


const paddleHeight = 10;
const paddleWidth = 75;

const canvasHeight = 400;
const canvasWidth = 600;
// Rendering constants
const rConst = {
  speedTargetMvmnt: 0.1
}

// State variables, mostly for rendering
const ctx = canvas.getContext("2d");

var statePanel = {
  time: 0
}

var stateBall = {
  x: canvas.width/2,
  y: canvas.height-30,
  r: 2,
  dx: 2,
  dy: -2,
}

var state = {
  init: false,
  arrBrick: [],
  ball: stateBall,
  panel: statePanel,
}

// bind the state to the event listeners
var renderer = new Renderer(ctx, state);
var stateCalculator = new StateCalculator(state);

// Main actions 
// Apply events listeners to elements
myInput.addEventListener("input", e => console.log(e.target.value));
myInput.addEventListener("keyup", stateCalculator.handleHitEnter);

// Render objects using rendering constants and state variables read-only
setInterval(renderer.render, 10);
setInterval(stateCalculator.calculateState, 10);



