import React, { Component } from 'react';
import './App.css';
import IdeaFeed from './components/IdeaFeed';


class App extends Component {


  render() {

/*
    const cards = [];

    for(int i = 0; i < 10; i++)
    {
      cards.push(<IdeaCard />);
    }
    */
    /*const elements = ["a", "b", "c"]*/

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
        
        {/*
        {elements.map((value,index) => {
          return <IdeaCard title="avi"/>
        })}
        */}

        <IdeaFeed />
    
      </div>

    );
  }
}

export default App;
