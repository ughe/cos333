import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, BrowserRouter, Link, generatePath } from 'react-router-dom';
import * as Yup from 'yup';
import Location from 'react-app-location';

import "./w3.css";
import './App.css';
import IdeaFeed from './components/IdeaFeed';
import IdeaCard from './components/Card/Card';
import TopBar from './components/TopBar';

import Helmet from 'react-helmet';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';



//const wholeNbr = Yup.number().integer().positive();



class App extends React.Component {
   constructor(props) {

    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.state = {
      query: null,
      isLoggedIn: false,
    }
  }

  handleChange = (event) => {
    this.setState({ query : event.target.value });
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
          this.setState({isLoggedIn: true});
          func();
          return true;
        }
        else
        {
          window.location.assign('/login');
          return false;
        }

      })
      .catch(err => {
        console.log("BATO err: " + err);
        //this.setState({isLoggedIn: true});
        window.location.assign('/login');
        return false;
      });
    } else {
      func();
      return true;
    }

  }

  render() {


    return (


      <div className="App">
        <Helmet>
          <style>{'body { background-color: #D3D3D3; }'}</style>
        </Helmet>


        <TopBar search ={this.handleChange}/>


        <IdeaFeed query={this.state.query} isLoggedInFunc={this.handleLogin}/>

      </div>

    );
  }
}

export default App;










