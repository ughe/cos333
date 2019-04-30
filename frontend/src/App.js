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



//const wholeNbr = Yup.number().integer().positive();



class App extends React.Component {
   constructor(props) {

    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      query: null,
    }
  }

  handleChange = (event) => {
    this.setState({ query : event.target.value });
  }


  render() {


    return (
      

      <div className="App">
        <Helmet>
          <style>{'body { background-color: #D3D3D3; }'}</style>
        </Helmet>

        <TopBar search ={this.handleChange}/>

        <IdeaFeed query={this.state.query}/>
        
      </div>

    );
  }
}

export default App;










