import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Comment from './comment.svg';
import Discussion from '../Discussion';



const styles = theme => ({
  card: {
    maxWidth: '500px',
    minWidth: '200px',
    [theme.breakpoints.down('sm')]: {
    margin: '10px 5px 5px',
    width: 'calc(100% - 10px)',
    },
    margin: '10px 10px',
    display: 'inline-block',
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
    height: '140px',
  },
  upvote: {
    color: 'green',
  },
  downvote: {
    color: 'red',
  },
  net_votes: {
    marginLeft: '5px',
    maxWidth: '50px',
    color: 'blue',
  },
  buttonMsg: {
    color: '#123456',
    marginLeft: 'auto',
  },
});


class IdeaCard extends React.Component {

  constructor(props) {
    super(props);
    this.discussion = this.discussion.bind(this)
    this.state = {
      title: this.props.title,
      description: this.props.description,
      net_votes: this.props.net_votes,
      photo_url: this.props.photo_url,
      id: this.props.id,
      open: false
    }
  }

  discussion = (id) => (e) => {
    this.props.discussion(id);
  }


  render () {

    const { classes } = this.props;

    return (
      <Card className={classes.card} >
      
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>
        
        <link href="https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css" rel="stylesheet"/>

        <CardActionArea>
          <CardContent>
            <Typography onClick={this.discussion(this.state.id)} gutterBottom variant="h5" component="h2">
              {this.state.title}
            </Typography>
            <Typography component="p" onClick={this.discussion(this.state.id)}>
              {this.state.description}
            </Typography>
          </CardContent>

          <CardMedia
            className={classes.media}
            image= {this.state.photo_url} 
            title="Contemplative Reptile"
            onClick={this.discussion(this.state.id)}
          /> 

        </CardActionArea>
        <CardActions>

          <IconButton className={classes.buttonUp} aria-label="arrow_upward">
            <i className="material-icons">
              arrow_upward
            </i>
          </IconButton>

          <IconButton className={classes.buttonDown} aria-label="arrow_downward">
            <i className="material-icons">
              arrow_downward
            </i>
          </IconButton>

          <div className={classes.net_votes}> {this.state.net_votes} </div>

          <IconButton className={classes.buttonMsg} aria-label="comment" onClick={this.discussion(this.state.id)}>
            <i className="icon ion-md-text"></i>
          </IconButton>



        </CardActions>

      </Card>
    );
  }
}

IdeaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(IdeaCard);

