import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (

      <div className="App">
        <header className="App-header">
          Tiger Teams
        </header>

        <div className="App-IdeaBox">
          <header className="App-IdeaBox-Header">
            Idea Box
          </header>

          <div className="App-IdeaBox-Tags">
            <button> Entreprenership </button>
            <button> Initiatives </button>
            <button> Apps </button>
            <button> Random </button>
          </div>

          <div className="App-IdeaBox-Box">

          </div>
        </div>


      </div>


    );
  }
}

export default App;
