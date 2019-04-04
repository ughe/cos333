import React, { Component } from 'react';
import "./w3.css";
import './App.css';
import IdeaFeed from './components/IdeaFeed';
import IdeaCard from './components/Card/Card'


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

        {/* TOP BAR */}
        <div>
          <div className="w3-bar w3-white w3-wide w3-padding w3-card w3-large">

            <a href="#home" className="w3-bar-item w3-button">Tiger<b>TEAMS</b></a>

            <div className="w3-bar-item w3-hide-small w3-right">
              <a href="#about" className="w3-bar-item w3-button">About</a>
            </div>

            <form className="w3-bar-item search-container center">
                <input type="text" id="search-bar" placeholder="..."/>
                <a href="#"><img className="search-icon" 
                src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"/></a>
            </form>

          </div>
        </div>

        <div>
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" 
          url = "http://extras.mnginteractive.com/live/media/site19/2018/0522/20180522__23ST_road_work~1.jpg" />
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" />
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" />
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" />
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" />
          <IdeaCard title = "Hemp Roads" description = {"Hemp-based road paving is an environmentally-friendly" 
          + " and cost-effective technology that has not yet been implemented in the US market."} score = "55" />
        </div>

      </div>

    );
  }
}

export default App;
