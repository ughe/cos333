import React, { Component } from 'react';
import "./w3.css";
import './App.css';
import IdeaFeed from './components/IdeaFeed';
import IdeaCard from './components/Card/Card'
import NewPost from './components/NewPost';
import SortBar from './components/SortBar';
import Login from './components/Login';
import Helmet from 'react-helmet';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

class App extends Component {
   constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      query: null,
    }
  }

  handleChange = (event) => {
    //this.setState({ query: event.target.value });
    console.log(document.getElementById("search").value);
  }


  render() {


    return (
      

      <div className="App">
        <Helmet>
          <style>{'body { background-color: #D3D3D3; }'}</style>
        </Helmet>

        {/* TOP BAR */}
        <div>
          <div className="w3-bar w3-white w3-wide w3-padding w3-card w3-large">
            <a href="#home" className="w3-bar-item w3-button">Tiger<b>TEAMS</b></a>

            <div className="w3-bar-item w3-hide-small w3-right">
              <Login className="w3-bar-item w3-hide-small w3-right" />
            </div>



            <div className="w3-bar-item w3-hide-small w3-right">
              <a href="#about" className="w3-bar-item w3-button">About</a>
            </div>

            <Search/>


            <form className="w3-bar-item search-container center">
                
                <input id="search" type="text" id="search-bar" placeholder="..."/>
                <IconButton onClick={this.handleChange} aria-label="search" style={{float: 'right'}}>
                  <i className="material-icons">
                    search
                  </i>
                </IconButton>
                
            </form>

          </div>
        </div>

        <IdeaFeed/>
        
      </div>

    );
  }
}

export default App;










