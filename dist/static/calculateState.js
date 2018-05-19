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

class StateCalculator {
  constructor(state) {
    this.state = state;

    this._updateArrBrick = this._updateArrBrick.bind(this);
    this._updateStateBall = this._updateStateBall.bind(this);
    this._updateStatePanel = this._updateStatePanel.bind(this);

    // Initialising the remaining uninitialised state variables
    // The device info will be sent from this function
    fetch('/api/initialize', {
      method: 'POST',
    }).then((res)=> {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    }).then((data) => {
      this.state.arrBrick = data.arrBrick;
      console.log('Initialised by state manager');
      console.log(this.state);
    }).catch((e) => {
      console.log(e);
    });
  }

  // Private methods
  _updateStateBall() {
    let s = this.state.ball;
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

  _updateArrBrick() {
    this.state.arrBrick.map((s)=> {
      s.x += (s.tx - s.x)*rConst.speedTargetMvmnt;
      s.y += (s.ty - s.y)*rConst.speedTargetMvmnt;   
    });
  }

  _updateStatePanel() {
    let s = this.state.panel;
    s.time += 1;
    panel.removeChild(panel.firstChild);
    let content = document.createTextNode((s.time/100).toString());
    panel.appendChild(content);
  }

  calculateState(state) {
    this._updateArrBrick();
    this._updateStateBall();
    this._updateStatePanel();
  }

  handleHitEnter(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      console.log(e);
      let cmd = e.target.value;
      console.log('I have now', cmd);
      e.target.value = '';

      fetch("/api/hit_enter", {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({'cmd': cmd}),
      }).then((res)=> {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      }).then((data) => {
        this.state.arrBrick = data.tasks;
        console.log(data);
        console.log(this.state);
      }).catch((e) => {
        console.log(e);
      });
    }
  }
}

export {
  StateCalculator,
}