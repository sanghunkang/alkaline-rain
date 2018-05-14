// Event Listeners
var stateEvent = {
  keydown13: false,
}

const handleHitEnter = (e)=> {

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
      console.log(e.target.state);
      e.target.state.arrBrick = data.tasks;
      console.log(data);
      console.log(e.target.state);
    }).catch((e) => {
      console.log(e);
    });
  }
}

const myFunction = (e)=> {
  console.log(e.target.value);
}

const handleKeyDown = (e)=> {
  // console.log(e.keyCode);

  if (e.keyCode === 39) {
    state.paddle.rightPressed = true;
  } else if (e.keyCode === 37) {
    state.paddle.leftPressed = true;
  }
}
const handleKeyUp = (e)=> {
  // console.log(e.keyCode);

  if (e.keyCode === 39) {
    state.paddle.rightPressed = false;
  } else if (e.keyCode === 37) {
    state.paddle.leftPressed = false;
  }
}

export {
  myFunction,
  handleHitEnter,
  handleKeyDown,
  handleKeyUp
}