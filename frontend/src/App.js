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
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      query: null,
      logIn: false,
    }
  }

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  }

  handleLogin = (event) => {
    console.log(this.state.logIn);

    if (this.state.logIn === false)
    {
      console.log(this.state.logIn);
      fetch('/api/whoami')
      .then(results => {
        this.setState({logIn: true});
        return results.json();
      }).then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log("hi");
        this.setState({logIn: true});
        window.location.assign('/login');
      });
    }
    
  }

  render() {


    return (
      

      <div className="App" onClick={this.handleLogin}>
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

           


            <form className="w3-bar-item search-container center">
                <input id="search" type="text" id="search-bar" placeholder="..." onChange={this.handleChange}/>
                <a href="#"><img className="search-icon" 
                src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"/></a>
            </form>

          </div>
        </div>

        <IdeaFeed query={this.state.query}/>
        
      </div>

    );
  }
}

export default App;










