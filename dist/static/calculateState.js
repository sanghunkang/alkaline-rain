import { tSNE } from '/static/tsne.js'; 
var tsne = new tSNE({
  epsilon: 10,
  perplexity: 5,
  dim: 2,
});


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
    this._calculateSimilarity = this._calculateSimilarity.bind(this);

    this.calculateState = this.calculateState.bind(this);
    this.handleHitEnter = this.handleHitEnter.bind(this);
    this.handleFeedObject = this.handleFeedObject.bind(this);

    // Initialising the remaining uninitialised state variables
    // The device info will be sent from this function
    fetch('/api/initialize', {
      method: 'POST',
    })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(data => {
      this.state.arrBrick = data.arrBrick;
      console.log('Initialised by state manager');
      console.log(this.state);

      let arrEmbedding = this.state.arrBrick.map(brick => brick.embedding);
      tsne.initDataRaw(arrEmbedding);

    })
    .catch(err => console.log(err));
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
    tsne.step();
    let Y = tsne.getSolution();
    let normCoef = tsne.getNormCoef();
    // console.log(Y);
    for (let i = 0; i < this.state.arrBrick.length; i++) { 
      this.state.arrBrick[i].x = 400/2 + Y[i][0]/normCoef[0]*300 + 100;
      this.state.arrBrick[i].y = 400/2 + Y[i][1]/normCoef[1]*300;
    }
  }

  _updateStatePanel() {
    let s = this.state.panel;
    s.time += 1;
  }

  _calculateSimilarity(X1, X2) {
    let prodX1X2 = 0;
    let l2normX1 = 0;
    let l2normX2 = 0;
    for (let i = 0; i < this.state.arrBrick.length; i++) {
      prodX1X2 += X1[i]*X2[i];
      l2normX1 += X1[i]*X1[i];
      l2normX2 += X2[i]*X2[i];
    }
    let sim = prodX1X2/(Math.sqrt(l2normX1)*Math.sqrt(l2normX2));
    console.log(sim);
  }

  calculateState() {
    this._updateArrBrick();
    this._updateStateBall();
    this._updateStatePanel();
  }

  handleHitEnter(e) {
    e.preventDefault();
    if (e.keyCode === 13) {
      console.log(e);
      let cmd = e.target.value;
      e.target.value = '';

      fetch("/api/enter_cmd", {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({'cmd': cmd}),
      })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(data => {
        this.state.panel.messageText = 'Successful command';
        this.state.panel.messageStatus = 'normal';
        
        this.state.history.data = data;

        // Similarity calculation
        this.state.arrBrick.map( brick => {
          this._calculateSimilarity(brick.embedding, data.embedding)
        });
      })
      .catch(err => {
        console.log(err);
        this.state.panel.messageText = 'Perhaps it\'s not really a word!';
        this.state.panel.messageStatus = 'warning';
        console.log('Perhaps it\'s not really a word!');
      });
    }
  }

  handleFeedObject(e) {
    console.log(this.state);
    fetch('/api/feed_object', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({}),
    })
    .then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      }
      return res.json();
    })
    .then(data => {
      this.state.arrBrick.push(data.point);
      console.log(this.state.arrBrick);

      // Do something with the embedding
      tsne.updateDataRaw(data.point.embedding);
    })
    .catch(err => console.log(err));

  }
}

export { StateCalculator }