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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';


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


class AddInterest extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      ideaId: this.props.ideaId,
    };
  }

  handleClick = (event) => {
    fetch('/api/whoami')
    .then(results => {
      return results.json();
    }).then(data => {
      fetch('/api/set/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },

        body: JSON.stringify({
          userNetid: data["user"],
          ideaId: this.state.ideaId,
        })
      })
      .then(res => {
        console.log("Response " + JSON.stringify(res));
        window.alert("Your interested has been added!");
      })
      .catch(err => {
        console.log("post error!");
        console.log(err);
      });
      
    })
    .catch(err => {
      window.location.assign('/login');
      console.log(err);
    })
  };  

  render() {

    const { classes } = this.props;

    const interests = this.state.interests;

    return (
      <MuiThemeProvider theme={theme}>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <Button aria-haspopup="false" variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                Join &nbsp;
              <i className="material-icons rightIcon">
                group_add
              </i>
        </Button>

      </MuiThemeProvider>

    );
  }
}

export default withStyles(styles)(AddInterest);