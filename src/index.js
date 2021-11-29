import React, { Component, PureComponent } from 'react';
import { render } from 'react-dom';
import { createSelector } from 'reselect';
import Hello from './Hello';
import './style.css';

const memoizee = fn => {
  let cache = {};
  return (...args) => {
    let stringifiedArgs = JSON.stringify(args)
    let result = cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args)
    return result
  }
}

class Items extends PureComponent {
  handleClick = memoizee((item) => () => this.props.onClick(item))
  render() {
    console.log('items rerender')
    return (
      <ul>
        {
            this.props.items.map((item) => (
              <Item item={item} key={item} onClick={this.handleClick(item)}/>
            ))
        }
      </ul>
    )
  }
}

class Italic extends PureComponent {
  render() {
    return (
      <i onClick={this.props.onClick}>Item</i>
    );
  }
}


class Item extends PureComponent {
  render() {
    const Tag = this.props.item % 2 ? Italic : 'li'
    return (
      <Tag onClick={this.props.onClick}>Item</Tag>
    );
  }
}

const itemsSelector = createSelector(
  ({ counter }) => counter,
  ({ counter2 }) => counter2,
  (counter, counter2) => Array.from(Array(counter * counter2).keys())
)

const getItems = (({ counter, counter2 }) => Array.from(Array(counter * counter2).keys()))

class App extends Component {  
  state = {
    counter: 1,
    counter2: 1,
    counter3: 1
  };
  handleAddCounter = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  };
  handleAddCounter2 = () => {
    this.setState({
      counter2: this.state.counter2 + 1
    })
  };
  handleAddCounter3 = () => {
    this.setState({
      counter3: this.state.counter3 + 1
    })
  };
  handleItemClick = (item) => {
    this.setState({
      item
    })
  };
  render() {
    const items = itemsSelector(this.state)
    // const items = getItems(this.state)
    return (
      <div>
        <div>clicked item index: {this.state.item}</div>
        <button onClick={this.handleAddCounter}>
          Add ({this.state.counter})
        </button>
        <button onClick={this.handleAddCounter2}>
          Add2 ({this.state.counter2})
        </button>
        <button onClick={this.handleAddCounter3}>
          Add3 ({this.state.counter3})
        </button>
        <Items items={items} onClick={this.handleItemClick}/>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
