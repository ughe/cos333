import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import theme from '../theme';



const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      user: null,
    }
  }

  handleClickOpen = () => {
    let n = () => {
      fetch('/api/whoami')
      .then(results => {
        return results.json();
      })
      .then(data => {
        console.log("data " + data["user"]);
        this.setState({
          loggedIn: true,
          user: data["user"],
        });
      });
      //this.setState( {loggedIn: true});
    }

    this.props.isLoggedInFunc(n);
  };

  componentWillReceiveProps(nextProps){
    this.setState({
      loggedIn: true,
      user: nextProps["user"],
    });
    //this.setState( {loggedIn: nextProps["isLoggedIn"]});
  }

  render() {

    const { classes } = this.props;

    let notLoggedIn = !this.state.loggedIn;

    if (!this.state.user)
    {
      notLoggedIn = true;
    }

    

    return (
      <MuiThemeProvider theme={theme}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        {notLoggedIn ?
        <Button variant="contained" color="white" className={classes.button} onClick={this.handleClickOpen}>
                Login
				<i class="material-icons">
					person_outline
				</i>
        </Button>
        : 
        <Button variant="contained" color="white" className={classes.button} onClick={this.handleClickOpen}>
                Welcome, {this.state.user}!
        <i class="material-icons">
          person_outline
        </i>
        </Button>}
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Login);

