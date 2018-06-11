import { tSNE } from '/static/tsne.js'; 

var tsne = new tSNE({
  epsilon: 10,
  perplexity: 5,
  dim: 2,
});

// Rendering constants
const canvasHeight = 400;
const canvasWidth = 600;

// Rendering constants are needed only here.
const rConst = {
  speedTargetMvmnt: 0.01
}

class StateCalculator {
  constructor(state) {
    this.state = state;

    this._updateArrPoint = this._updateArrPoint.bind(this);
    this._updateStateBall = this._updateStateBall.bind(this);
    this._updateStatePanel = this._updateStatePanel.bind(this);
    this._removeHitPoints = this._removeHitPoints.bind(this);
    this._calculateSimilarity = this._calculateSimilarity.bind(this);
    this._switchPanelMessage = this._switchPanelMessage.bind(this);

    this.calculateState = this.calculateState.bind(this);
    this.handleHitEnter = this.handleHitEnter.bind(this);
    this.handleFeedObject = this.handleFeedObject.bind(this);

    // Initialising the remaining uninitialised state variables
    // The device info will be sent from this function
    fetch('/api/initialize', { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      this.state.arrPoint = data.arrPoint;
      console.log('Initialised by state manager');
      console.log(this.state);

      let arrEmbedding = this.state.arrPoint.map(point => point.embedding);
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

  _updateArrPoint() {
    tsne.step();
    let Y = tsne.getSolution();
    let normCoef = tsne.getNormCoef();
    // console.log(Y);
    for (let i = 0; i < this.state.arrPoint.length; i++) { 
      this.state.arrPoint[i].x = 400/2 + Y[i][0]/normCoef[0]*300 + 100;
      this.state.arrPoint[i].y = 400/2 + Y[i][1]/normCoef[1]*300;
    }
  }

  _updateStatePanel() { 
    this.state.panel.time += 1
  }

  _removeHitPoints(arrSim) {
    let arrPointHit = arrSim.filter(sim => 0.7 < sim[1] && sim[1] < 1);
    for (let i = arrPointHit.length - 1; 0 <= i; i--) {
      this.state.arrPoint.pop(arrPointHit[i][0]);
    }
    tsne.removeDatapoints(arrPointHit);
  }

  _calculateSimilarity(X1, X2) {
    let l2normX1 = X1.reduce( (x1, x2)=> { return x1 + x2*x2; } ); // Sum of squares
    let l2normX2 = X2.reduce( (x1, x2)=> { return x1 + x2*x2; } ); // Sum of squares
    let prodX1X2 = 0;
    for (let i = 0; i < X1.length; i++) {
      prodX1X2 += X1[i]*X2[i];
    } // Inner product

    let sim = prodX1X2/(Math.sqrt(l2normX1)*Math.sqrt(l2normX2)); // Cosine similarity
    return sim;
    // console.log(sim);
  }

  _switchPanelMessage(messageStatus) {
    if ( messageStatus === 'normal' ) {
      this.state.panel.messageStatus = 'normal';
      this.state.panel.messageText = 'Successful command';
    } else if ( messageStatus === 'warning') {
      this.state.panel.messageStatus = 'warning';
      this.state.panel.messageText = 'Perhaps it\'s not really a word!';
    }
  }

  calculateState() {
    this._updateArrPoint();
    this._updateStateBall();
    this._updateStatePanel();
  }

  handleHitEnter(e) {
    console.log(e);
    e.preventDefault();
    if (e.keyCode === 13) {
      let params = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({'cmd': e.target.value}),
      }
      e.target.value = '';

      fetch("/api/enter_cmd", params)
      .then(res => res.json())
      .then(data => {
        this._switchPanelMessage('normal');
        
        this.state.history.data = data;

        // Similarity calculation
        let arrSim = this.state.arrPoint.map((point, i) => {
          return [i, this._calculateSimilarity(point.embedding, data.embedding)];
        });
        console.log(arrSim);
        this._removeHitPoints(arrSim);
      })
      .catch(err => this._switchPanelMessage('warning'));
    }
  }

  handleFeedObject(e) {
    console.log(this.state);
    let params = {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({}),
    };

    fetch('/api/feed_object', params)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      this.state.arrPoint.push(data.point);
      tsne.insertDatapoint(data.point.embedding);
    })
    .catch(err => console.log(err));

  }
}

export { StateCalculator }