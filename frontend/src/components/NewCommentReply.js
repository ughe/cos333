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
    marginLeft: 'auto',
    marginRight: '0',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});


class NewCommentReply extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content: null,
      net_votes: 0,
      author: null,
      commentId: this.props.commentId,
      open: false,
    }
  }

  handleChangeContent = (event) => {
     this.setState({content: event.target.value});
  }

  handleChangeAuthor = (event) => {
     this.setState({author: event.target.value});
  }

  handleClose = (event) => {
     //Make a network call somewhere
     this.setState({ open: false });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleSubmit = (content, author) => (e) => {

    //Get Author
    fetch('/api/whoami')
    .then(results => {
    	return results.json();
    }).then(data => {

    	const comment = {
    	  content: this.state.content,
    	  userNetid: data["user"],
    	  net_votes: 0,
    	  commentId: this.state.commentId,
    	};

    	fetch('/api/set/comment', {
    	  method: 'POST',
    	  headers: {
    	    'Content-Type': 'application/json',
    	  },

    	  body: JSON.stringify(comment)
    	})
    	.then(function(response){
    	  return response.json();
    	})
    	.then(data => {
    		//this.props.update();
        this.props.update();
    	})
    	.catch(err => {
    	  window.location.assign('/login');
    	  console.log(err);
    	});
    });

    //Idea Post
    
    

    this.setState({ open: false });

  }

  render() {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme} className={classes.container}>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>

        <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleClickOpen}>
                Reply
              <i className="material-icons rightIcon">
                reply
              </i>
        </Button>


        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-content"
          onSubmit={this.handleSubmit}
        >
          <DialogTitle id="form-dialog-content">New Comment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the content of comment
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Content"
              type="email"
              fullWidth
              multiline
              rows ="1"
              rowsMax="2"
              onChange={this.handleChangeContent}
              required
            />

            <br/>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit(this.state.content, this.state.author)} color="secondary">
              Comment
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(NewCommentReply);
