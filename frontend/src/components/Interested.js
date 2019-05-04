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


class Interested extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      anchorEl: null,
      interests: [],
    };
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
    const eventStore = event;
    console.log(eventStore);
    localStorage.setItem('buttonClick', event.currentTarget);
    fetch('/api/get/idea/' + this.props.ideaId)
    .then(results => {
      return results.json();
    }).then(data => {
      let dataRet = data[0]["interests"];
      console.log("fetched interests" + data);

      console.log(dataRet);
      let fetchedData = [];
      console.log("reached");
      for(var i = 0; i < dataRet.length; i++)
      {
        let user = dataRet[i]["userNetid"];
        fetchedData = [...fetchedData, user];
      }

      console.log(fetchedData);
      console.log("Event Value");
      console.log(event.currentTarget);
      console.log(eventStore);
      this.setState({
        anchorEl: localStorage.getItem('buttonClick'),
        interests: fetchedData,
      });
    })
    .catch(err => {
      console.log("Error " + err);
    });
  };  
    

  handleClose = (keyWord) => {
    this.setState({ anchorEl: null });
  };

  render() {

    const { classes } = this.props;
    const anchorEl = this.state.anchorEl;

    const interests = this.state.interests;

    return (
      <MuiThemeProvider theme={theme}>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <Button aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                Get in Touch
              <i className="material-icons rightIcon">
                sort
              </i>
        </Button>
        
        <Dialog open={Boolean(anchorEl)}>
          <DialogTitle id="form-dialog-title">Interested People</DialogTitle>
          <List onClose={this.handleClose}>
          {interests.map(interest => (
            <ListItem button key={interest}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={interest} />
            </ListItem>
          ))}
          </List>

          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>

        </Dialog>



      </MuiThemeProvider>

    );
  }
}

export default withStyles(styles)(Interested);
