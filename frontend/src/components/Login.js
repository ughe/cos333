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
      loggedIn: this.props.isLoggedIn,
    }
  }

  handleClickOpen = () => {
    let n = () => {
      this.setState( {loggedIn: true});
    }

    this.props.isLoggedInFunc(n)
    .then(res => {
        this.setState( {loggedIn: true});
    });
  };

  componentWillReceiveProps(nextProps){
    console.log("HELLO!");
    this.setState( {loggedIn: nextProps["isLoggedIn"]});
  }

  render() {

    const { classes } = this.props;

    const notLoggedIn = !this.state.loggedIn;

    console.log("Am I not logged in: " + notLoggedIn);

    return (
      <MuiThemeProvider theme={theme}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        {notLoggedIn ?
        <Button variant="contained" color="white" className={classes.button} onClick={this.handleClickOpen}>
                Login
				<i className ="material-icons">
					person_outline
				</i>
        </Button>
        : 
        <Button variant="contained" color="white" className={classes.button}>
                Welcome!
        <i class="material-icons">
          person_outline
        </i>
        </Button>}
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Login);

