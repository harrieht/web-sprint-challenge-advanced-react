import React from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  state = initialState;

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState(initialState);
  };

  getNextIndex = (direction) => {
    const { index } = this.state;
    const x = index % 3;
    const y = Math.floor(index / 3);

    switch (direction) {
      case 'left':
        return x > 0 ? index - 1 : index;
      case 'right':
        return x < 2 ? index + 1 : index;
      case 'up':
        return y > 0 ? index - 3 : index;
      case 'down':
        return y < 2 ? index + 3 : index;
      default:
        return index;
    }
  };

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction);
    this.setState((prevState) => ({
      index: nextIndex,
      steps: prevState.steps + 1,
    }));
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = this.getXY();
    const { steps, email } = this.state;
    const payload = {
      x,
      y,
      steps,
      email,
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ message: data.message });
      })
      .catch((error) => {
        this.setState({ message: 'Error: ' + error.message });
      });
  };

  render() {
    const { className } = this.props;
    const { message, steps, email } = this.state;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {steps} times</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? ' active' : ''}`}
            >
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            Reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          ></input>
          <input id="submit" type="submit" value="Submit"></input>
        </form>
      </div>
    );
  }
}
