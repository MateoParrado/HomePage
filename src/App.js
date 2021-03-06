import React, { useState, useEffect, Component } from 'react';
import api from './apiKeys'
import SixersTab from './sixers'
import BucksTab from './bucks'
import Weather from './weather'

class App extends Component {

  constructor(){
    super();
  }

  render() {
    return (
      <div className="grid-container" >
        <Weather></Weather>
        <div className="todo-div">
          <object type="text/html" height="100%" width="100%" data="https://priyapshah.github.io/toDoMultipleLists" object-fit="fill"></object>
        </div>
        <SixersTab></SixersTab><BucksTab></BucksTab>
      </div>
    );
  }

}

export default App;
