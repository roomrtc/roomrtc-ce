import React from 'react';

export interface CounterState {
  counter: number;
}

class Counter extends React.Component<{}, CounterState> {

  constructor(props: any) {
    super(props);
    this.state = { counter: 0 };
  }

  incrementCounter() {
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div>
        <h1>counter at: {this.state.counter}</h1>
        <button
          onClick={() => this.incrementCounter()}
        />
      </div>
    );
  }
}

export default Counter;
