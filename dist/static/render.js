// Rendering constants
const paddleHeight = 10;
const paddleWidth = 75;

const brickRowCount = 3;
const brickColumnCount = 5;

const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const canvasHeight = 400;
const canvasWidth = 600;

// Rendering constants are needed only here.
const rConst = {
  speedTargetMvmnt: 0.01
}

// Render "objects"
const renderBall = (ctx, s)=> {
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
const renderPaddle = (ctx, s)=> {
  ctx.beginPath();
  ctx.rect(s.x, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FF95DD";
  ctx.fill();
  ctx.closePath();
}

const renderBrick = (ctx, brick)=> {
  ctx.beginPath();
  ctx.arc(brick.x, brick.y, 10, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.font = "20px Arial";
  ctx.fillText(brick.id, brick.x, brick.y);
  ctx.closePath();
}

const renderArrBrick = (ctx, arrBrick)=> {
  arrBrick.map((brick)=> renderBrick(ctx, brick));
}

const renderPanel = ()=> {
  ;
}

const render = (ctx, state)=> {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  renderArrBrick(ctx, state.arrBrick);
  renderBall(ctx, state.ball);
  renderPaddle(ctx, state.paddle);
  renderPanel(ctx, state.panel);
}

export {
  render,
}