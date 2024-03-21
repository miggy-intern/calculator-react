import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Style from './src/Style';
import InputButton from './src/InputButton';

const inputButtons = [
  [1, 2, 3, '/'],
  [4, 5, 6, '*'],
  [7, 8, 9, '-'],
  [0, '.', '=', '+'],
  ['Clear', 'Clear All']
];

class ReactCalculator extends Component {

  constructor(props) {
    super(props);

    this.state = {
      previousInputValue: 0,
      inputValue: 0,
      selectedSymbol: null
    }
  }

  _onInputButtonPressed(input) {
    switch (typeof input) {
      case 'number':
        return this._handleNumberInput(input);
      case 'string':
        return this._handleStringInput(input);
    }
  }

  _handleNumberInput(num) {
    let inputValue;
    if (this.state.inputValue === 0 || this.state.inputValue === '0') {
      inputValue = num;
    } else {
      inputValue = parseFloat(this.state.inputValue.toString() + num);
    }
    this.setState({
      inputValue: inputValue
    });
  }

  _handleDecimalInput() {
    if (!this.state.inputValue.toString().includes('.')) {
      let inputValue = this.state.inputValue.toString() + '.';
      this.setState({
        inputValue: inputValue
      });
    }
  }

  _handleStringInput(str) {
    switch (str) {
      case '/':
      case '*':
      case '+':
      case '-':
        this.setState({
          selectedSymbol: str,
          previousInputValue: this.state.inputValue,
          inputValue: 0
        });
        break;

      case '.':
        this._handleDecimalInput();
        break;

      case '=':

        let symbol = this.state.selectedSymbol,
          inputValue = this.state.inputValue,
          previousInputValue = this.state.previousInputValue;

        if (!symbol) {
          return;
        }

        if (symbol === '/' && inputValue === 0) {
          this.setState({
            inputValue: "Cannot be divided into 0",
            previousInputValue: 0,
            selectedSymbol: null
          });
          return;
        }

        this.setState({
          previousInputValue: 0,
          inputValue: eval(previousInputValue + symbol + inputValue),
          selectedSymbol: null
        });
        break;

      case 'Clear All':
        this.setState({
          selectedSymbol: null,
          previousInputValue: 0,
          inputValue: 0
        });
        break;

      case 'Clear':
        this.setState({
          inputValue: 0,
        })
    }
  }

  _renderInputButtons() {
    let views = [];

    for (let r = 0; r < inputButtons.length; r++) {
      let row = inputButtons[r];

      let inputRow = [];
      for (let i = 0; i < row.length; i++) {
        let input = row[i];

        inputRow.push(
          <InputButton
            value={input}
            highlight={this.state.selectedSymbol === input}
            onPress={this._onInputButtonPressed.bind(this, input)}
            key={r + "-" + i} />
        );
      }
      views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>);
    }


    return views;
  }

  render() {
    return (
      <View style={Style.rootContainer}>
        <View style={Style.displayContainer}>
          <Text style={Style.displayText}>{this.state.inputValue}</Text>
        </View>
        <View style={Style.inputContainer}>
          {this._renderInputButtons()}
        </View>
      </View>
    )
  }
}

export default ReactCalculator;
