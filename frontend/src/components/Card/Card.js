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
    background: 'rgba(255, 255, 255, 0.85)',
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
    height: '140px',
  },
  upVoteColored: {
    color: 'green',
  },
  downVoteColored: {
    color: 'red'
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
      open: false,
      voteDirection: this.props.voteDirection,
      author: this.props.author,
    }
  }

  discussion = (id) => (e) => {
    let n = () => {
      this.props.discussion(id);
    }

    this.props.isLoggedInFunc(n);
  }

  delete = (event) => {
    alert("Your idea has been deleted.");

    fetch('/api/del/idea/' + this.state.id)
    .then(this.props.del());
  }

  vote = (value) => (e) => {
    const ideaId = this.state.id;
    fetch('/api/whoami')
    .then(results => {
    return results.json();
    }).then( data => {
      const netid = data["user"];
      // Vote
      const vote = {
        netid: netid,
        is_upvote: (value === 1),
        is_idea: true,
        ideaId: ideaId,
      };

      // Post new vote{isUpVote ? classes.upVoteColored : classes.upVote}
      fetch('/api/set/vote/idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(vote)
      })
      .then(function(response){
        return response.json();
      })
      .then(data => {
        console.log("Banana");
        console.log(data);
        data["voteDirection"] = (value === 1);
        this.setState(data)
      })
      .catch(err => {
        window.location.assign('/login');
        console.log(JSON.stringify(err));
      });
    });
  }


  render () {

    const { classes } = this.props;
    let isUpVote = null;
    let isDownVote = null;
    let remove = (this.state.author === this.props.user);

    if(this.state.voteDirection === null)
    {
      isUpVote = false;
      isDownVote = false;
    } else {
      isUpVote = this.state.voteDirection;
      isDownVote = !this.state.voteDirection;
    }

    return (
      <Card className={classes.card} >

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <link href="https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css" rel="stylesheet"/>

        <CardActionArea onClick={this.discussion(this.state.id)}>
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

          <IconButton className={isUpVote ? classes.upVoteColored : classes.upVote} aria-label="arrow_upward"
            onClick={this.vote(1)}>
            <i className="material-icons">
              arrow_upward
            </i>
          </IconButton>

          <div className={classes.net_votes}> {this.state.net_votes} </div>

          <IconButton className={isDownVote ? classes.downVoteColored : classes.downVote} aria-label="arrow_downward"
            onClick={this.vote(-1)}>
            <i className="material-icons">
              arrow_downward
            </i>
          </IconButton>

          <IconButton className={classes.buttonMsg} aria-label="comment" onClick={this.discussion(this.state.id)}>
            <i className="icon ion-md-text"></i>
          </IconButton>

          {remove ?
          <IconButton className={classes.buttonDelete} aria-label="delete" onClick={this.delete}>
            <i className="material-icons">
              delete
            </i>
          </IconButton>
          : null}


        </CardActions>

      </Card>
    );
  }
}

IdeaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(IdeaCard);

