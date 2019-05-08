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
import PropTypes from 'prop-types';
import BackgroundImage from './components/BackgroundImage';

class App extends Component {
   constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      query: null,
      isLoggedIn: false,
      user: "",
    }

  }

  handleChange = (event) => {
    this.setState({ query: event.target.value });
  }

  handleLogin = (func) => {

    console.log(this.state.isLoggedIn);
    
    if (this.state.isLoggedIn === false)
    {
      fetch('/api/whoami')
      .then(results => {
        return results.json();
      }).then(data => {
        if (data["user"])
        {
          localStorage.clear();
          this.setState({isLoggedIn: true});
          func();
          return true;
        }
        else
        {
          localStorage.setItem('login', true);
          window.location.assign('/login');

          console.log("AFTER ASSIGN");
          //this.setState({isLoggedIn: !this.state.isLoggedIn})
          func();
          return false;
        }

      })
      .catch(err => {
        console.log("BATO err: " + err);
        localStorage.setItem('login', true);
        window.location.assign('/login');
        return false;
      });
    } else {
      func();
      return true;
    }
    
    func();

  }

  componentDidMount()
  {
    fetch('/api/whoami')
    .then(results => {
      return results.json();
    }).then(data => {
      console.log("user: " + data["user"]);
      this.setState({user: data["user"]});
    });
  }

  render() {

    console.log("Should only appear once");
    let login = this.state.isLoggedIn;
    console.log(login);

    if(!this.state.isLoggedIn)
    {
      if(localStorage.getItem('login'))
      {
        login = true;
      }
    } else {
      login = true;
    }

    console.log("LOG: " + login);
    console.log("STATE " + this.state.isLoggedIn);
    localStorage.clear();

    return (
      <div className="App">
        <Helmet>
        

        </Helmet>

        {/* TOP BAR */}
        <div>
          <div className="w3-bar w3-white w3-wide w3-padding w3-card w3-large">
            <a href="#home" className="w3-bar-item w3-button">Tiger<b>TEAMS</b></a>

            <div className="w3-bar-item w3-hide-small w3-right">
              <Login className="w3-bar-item w3-hide-small w3-right" user={this.state.user} isLoggedInFunc={this.handleLogin} isLoggedIn={login}/>
            </div>

            <form className="w3-bar-item search-container center">
                <input id="search" type="text" id="search-bar" placeholder="..." onChange={this.handleChange}/>
                <a href="#"><img className="search-icon"
                src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"/></a>
            </form>

          </div>
        </div>

        <IdeaFeed query={this.state.query} isLoggedInFunc={this.handleLogin} user={this.state.user}/>

      </div>

    );
  }
}

export default App;










