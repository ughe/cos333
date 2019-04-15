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


class NewPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      url: null,
      open: false,
    }
  }

  handleChangeTitle = (event) => {
     this.setState({title: event.target.value});
  }

  handleChangeDescription = (event) => {
     this.setState({description: event.target.value});
  }

  handleChangeUrl = (event) => {
     this.setState({url: event.target.value});
  }


  handleClose = (event) => {
     //Make a network call somewhere
     this.setState({ open: false });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleSubmit = (title, content, photo_url) => (e) => {

    
    const idea = {
      userNetid: "eiseisgruber",
      title: this.state.title,
      content: this.state.description,
      photo_url: this.state.url,
      upvotes: '[]',
      downvotes: '[]',
      tags: '[]',
    };

    fetch('/api/set/idea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(idea)
    })
    .then(data => {
      window.location.reload();
    })
    .catch(err => {
      console.log(err);
    });




    this.setState({ open: false });



  }

  render() {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleClickOpen}>
                Post an Idea
              <i className="material-icons rightIcon">
                create
              </i>
        </Button>


        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          onSubmit={this.handleSubmit}
        >
          <DialogTitle id="form-dialog-title">New Idea</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the title of your new idea
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="email"
              fullWidth
              multiline
              rows ="1"
              rowsMax="2"
              onChange={this.handleChangeTitle}
            />
            <br/>

            <DialogContentText>
              Enter a concise description of your idea.  Think of it as the shortened elevator pitch that describes what your idea is fundamentally about so that readers can get a quick sense of you idea. 
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Quick Description"
              type="email"
              fullWidth
              multiline
              rows ="2"
              rowsMax="4"
              onChange={this.handleChangeDescription}
            />

            <DialogContentText>
              Enter an image url to display as a thumbnail photo symbolizing something about your idea
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Image"
              type="email"
              fullWidth
              multiline
              rows ="1"
              rowsMax="2"
              onChange={this.handleChangeUrl}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit(this.state.title, this.state.content, this.state.photo_url)} color="secondary">
              Post
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(NewPost);
