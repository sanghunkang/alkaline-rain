// Rendering constants
const paddleHeight = 10;
const paddleWidth = 75;

const PointRowCount = 3;
const PointColumnCount = 5;

const PointWidth = 75;
const PointHeight = 20;
const PointPadding = 10;
const PointOffsetTop = 30;
const PointOffsetLeft = 30;

const canvasHeight = 400;
const canvasWidth = 600;

// Rendering constants are needed only here.
const rConst = {
  speedTargetMvmnt: 0.01
}

class Renderer {
  constructor(ctx, document, state) {
    this.ctx = ctx;
    this.document = document;
    this.state = state;

    this._renderBall = this._renderBall.bind(this);
    this._renderArrPoint = this._renderArrPoint.bind(this);
    this._renderPanel = this._renderPanel.bind(this);
    this.render = this.render.bind(this);
  }

  _renderArrPoint() {
    this.state.arrPoint.map((point)=> {
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 2, 0, Math.PI*2);
      if (point.status === 1) {
        this.ctx.fillStyle = '#FF95DD';
      } else if (point.status === 2) {
        this.ctx.fillStyle = '#0095DD';
      }

      this.ctx.fill();
      this.ctx.font = '15px Arial';
      this.ctx.fillStyle = '#FF95DD';
      this.ctx.fillText(point.word, point.x, point.y);
      this.ctx.closePath();
    });
  }

  _renderPanel() {
    let panelTimer = document.getElementById('panel-timer');
    panelTimer.innerHTML = (this.state.panel.time/10).toString();
    
    let panelMessage = document.getElementById('panel-message');
    panelMessage.setAttribute('class', this.state.panel.messageStatus);
    panelMessage.innerHTML = this.state.panel.messageText;
  }

  render() {
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    this._renderArrPoint();
    this._renderPanel();
  }
}

export {
  Renderer,
}