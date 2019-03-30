import React, { Component } from 'react';
import './App.css';
import Card from './components/Card/Card';

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

        <Card> </Card>
        <Card> </Card>


      </div>

    );
  }
}

export default App;
