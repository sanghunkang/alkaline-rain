const canvas = document.getElementById("myCanvas");
const myInput = document.getElementById("myInput");
const panel = document.getElementById('panel');

const paddleHeight = 10;
const paddleWidth = 75;


const brickRowCount = 3;
const brickColumnCount = 5;

const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// State variables, mostly for rendering
var ctx = canvas.getContext("2d");
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

var arrBrick = new Array(brickRowCount * brickColumnCount);
for (let i = 0; i < arrBrick.length; i++) {
  arrBrick[i] = {
    x: ((i % brickColumnCount)*(brickWidth+brickPadding))+brickOffsetLeft,
    y: (Math.floor(i / brickColumnCount)*(brickHeight+brickPadding))+brickOffsetTop,
    status: 1
  }
}

var statePaddle = {
  x: (canvas.width-paddleWidth)/2,
  rightPressed: false,
  leftPressed: false,
}


// Render "objects"
var renderBall = (s)=> {
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}
var renderPaddle = (s)=> {
  ctx.beginPath();
  ctx.rect(s.x, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FF95DD";
  ctx.fill();
  ctx.closePath();
}

var renderBrick = (brick)=> {
  if (brick.status == 1) {
    ctx.beginPath();
    ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
  
    ctx.fillStyle = "#0095DD";
    ctx.fill();
  
    ctx.fillStyle = "#FF95DD";
    ctx.fillText("A brick", brick.x, brick.y);
    ctx.closePath();
  }
}

var renderArrBrick = ()=> {
  arrBrick.map((brick)=> renderBrick(brick));
}

var renderPanel = ()=> {
  ;
}


// Update state variables
var updateStateBall = (s)=> {
  if (s.x + s.dx > canvas.width-s.r || s.x + s.dx < s.r) {
    s.dx = -s.dx;
  }

  if (s.y + s.dy < s.r) {
    s.dy = -s.dy;
  } else if (s.y + s.dy > canvas.height-s.r) {
    if (s.x > s.x && s.x < s.x + paddleWidth) {
      if (s.y = s.y - paddleHeight){
        s.dy = -s.dy  ;
      }
    } else {
      s.dy = -s.dy;
      // alert("GAME OVER");
      // document.location.reload();
    }
  }

  s.x += s.dx;
  s.y += s.dy;
}

var updateArrBrick = (arrBrick)=> {
  console.log(arrBrick);
  arrBrick[statePanel.time % 15].x += 2;
  arrBrick[statePanel.time % 15].y -= 2;
  // arrBrick[statePanel.time % 15].status = 0;
}

var updateStatePaddle = (s)=> {
  if (s.rightPressed && s.x < canvas.width-paddleWidth) {
    s.x += 4;
  } else if (s.leftPressed && s.x > 0) {
    s.x -= 4;
  }
}

var updateStatePanel = ()=> {
  statePanel.time += 1;
  var content = document.createTextNode((statePanel.time/100).toString());
  panel.removeChild(panel.firstChild);
  panel.appendChild(content);
}

var updateState = ()=> {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Actions using state variables on read-only manner
  renderArrBrick();
  renderBall(stateBall);
  renderPaddle(statePaddle);
  renderPanel();
  
  updateStateBall(stateBall);
  updateStatePaddle(statePaddle);
  updateStatePanel();
}



// Event Listeners
const myFunction= (e)=> {
  console.log(e.target.value);
}

const handleKeyDown = (e)=> {
  if (e.keyCode == 39) {
    statePaddle.rightPressed = true;
  } else if (e.keyCode == 37) {
    statePaddle.leftPressed = true;
  }
}
const handleKeyUp = (e)=> {
  if (e.keyCode == 39) {
    statePaddle.rightPressed = false;
  } else if (e.keyCode == 37) {
    statePaddle.leftPressed = false;
  }
}

const handleHitEnter = (e)=> {
  e.preventDefault();
  if (e.keyCode === 13) {
    console.log('I have now', e.target.value);
    fetch("/api/hit_enter", {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({'e': e.target.value}),
    }).then((res)=> {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    }).then((data) => {
      updateArrBrick(arrBrick);
      console.log(data);
    }).catch((e) => {
      console.log(e);
    });
  }
}

// Apply events listeners to elements
document.addEventListener("keydown", handleKeyDown, false);
document.addEventListener("keyup", handleKeyUp, false);


myInput.addEventListener("input", myFunction);
myInput.addEventListener("keyup", handleHitEnter);



setInterval(updateState, 10);