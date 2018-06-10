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


class Renderer {
  constructor(ctx, document, state) {
    this.ctx = ctx;
    this.document = document;
    this.state = state;

    this._renderBall = this._renderBall.bind(this);
    this._renderArrBrick = this._renderArrBrick.bind(this);
    this._renderPanel = this._renderPanel.bind(this);
    this.render = this.render.bind(this);
  }

  _renderBall() {
    let s = this.state.ball;
    this.ctx.beginPath();
    this.ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  _renderArrBrick() {
    this.state.arrBrick.map((brick)=> {
      this.ctx.beginPath();
      this.ctx.arc(brick.x, brick.y, 2, 0, Math.PI*2);
      if (brick.status === 1) {
        this.ctx.fillStyle = '#FF95DD';
      } else if (brick.status === 2) {
        this.ctx.fillStyle = '#0095DD';
      }

      this.ctx.fill();
      this.ctx.font = '15px Arial';
      this.ctx.fillStyle = '#FF95DD';
      this.ctx.fillText(brick.word, brick.x, brick.y);
      this.ctx.closePath();
    });
  }

  _renderPanel() {
    let panelTimer = document.getElementById('panel-timer');
    panelTimer.innerHTML = (this.state.panel.time/10).toString();//document.createTextNode((s.time/100).toString());
    
    let panelMessage = document.getElementById('panel-message');
    panelMessage.setAttribute('class', this.state.panel.messageStatus);
    panelMessage.innerHTML = this.state.panel.messageText;
    // this.panel.innerHTML = content;
    // panel.empty()//removeChild(panel.firstChild);
    // panel.appendChild(content);
    ;
  }

  render() {
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    this._renderArrBrick();
    this._renderBall();
    this._renderPanel();
  }
}

export {
  Renderer,
}