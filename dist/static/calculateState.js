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

const rConst = {
  speedTargetMvmnt: 0.01
}

// Update state variables
const updateStateBall = (s)=> {
  if (s.x + s.dx > canvasWidth-s.r || s.x + s.dx < s.r) {
    s.dx = -s.dx;
  }

  if (s.y + s.dy < s.r) {
    s.dy = -s.dy;
  } else if (s.y + s.dy > canvasHeight-s.r) {
    if (s.x > s.x && s.x < s.x + paddleWidth) {
      if (s.y = s.y - paddleHeight){
        s.dy = -s.dy  ;
      }
    } else {
      s.dy = -s.dy;
    }
  }

  s.x += s.dx;
  s.y += s.dy;
}

const updateArrBrick = (arrS)=> {
  arrS.map((s)=> {
    s.x += (s.tx - s.x)*rConst.speedTargetMvmnt;
    s.y += (s.ty - s.y)*rConst.speedTargetMvmnt;   
  });
}

const updateStatePaddle = (s)=> {
  if (s.rightPressed && s.x < canvasWidth-paddleWidth) {
    s.x += 4;
  } else if (s.leftPressed && s.x > 0) {
    s.x -= 4;
  }
}

const updateStatePanel = (s)=> {
  s.time += 1;
  panel.removeChild(panel.firstChild);
  let content = document.createTextNode((s.time/100).toString());
  panel.appendChild(content);
}

const calculateState = (state)=> {
  updateArrBrick(state.arrBrick);
  updateStateBall(state.ball);
  updateStatePaddle(state.paddle);
  updateStatePanel(state.panel);
}

export {
  calculateState,
}