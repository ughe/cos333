import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from '@material-ui/core/Button';

import NewCommentReply from "./NewCommentReply"
import "../w3.css";

const styles = theme => ({
  contain: {
    maxWidth: '600px',
    margin: '0 auto',
    maxHeight: '300px',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '30px',
    marginBottom: '30px',
    maxHeight: '300px',
  },
  replyCard:{
    maxWidth: '500px',
    marginTop: '10px',
    clear: 'both',
    margin: '0 auto',
    marginRight: '0px',
    marginBottom: '10px',
    maxHeight: '300px',
  },
  upVoteColored: {
    color: 'green',
  },
  downVoteColored: {
    color: 'red'
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: '#01BAEF'
  }
});



class Comment extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        content: "",
        net_votes: null,
        author: "",
        id: "",
        ideaId: "",
        commentId: "",
        open: false,
        expanded: true,
        voteDirection: null,
      }

      this.state.content = this.props.content;
      this.state.net_votes = this.props.net_votes;
      this.state.author = this.props.author;
      this.state.id = this.props.id;
      this.state.ideaId = this.props.ideaId;
      this.state.commentId = this.props.commentId;
      this.state.voteDirection = this.props.voteDirection;
    }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleReply = (event) => {

  }

  vote = (value) => (e) => {
    const commentId = this.state.id;
    fetch('/api/whoami')
    .then(results => {
    return results.json();
    }).then( data => {
      const netid = data["user"];
      // Vote
      const vote = {
        netid: netid,
        is_upvote: (value === 1),
        is_idea: false,
        commentId: commentId,
      };

      // Post new vote{isUpVote ? classes.upVoteColored : classes.upVote}
      fetch('/api/set/vote/comment', {
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

  render() {
    const { classes } = this.props;

    let isTopLevel = (this.state.ideaId !== null);

    if(this.state.author === null)
    {
      this.state.author = 'No author';
    }

    let isUpVote = null;
    let isDownVote = null;

    if(this.state.voteDirection === null)
    {
      isUpVote = false;
      isDownVote = false;
    } else {
      isUpVote = this.state.voteDirection;
      isDownVote = !this.state.voteDirection;
    }

    return (
      <div className={classes.contain}>
        <Card className={isTopLevel ? classes.card : classes.replyCard}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {this.state.author.substring(0,2).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={this.props.author}
            subheader="Recently"
          />
          <CardContent>
            <Typography component="p">
              {this.props.content}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            
            {isTopLevel ? 
            <div>
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
            </div>
            : null}

            {isTopLevel ? <NewCommentReply className="w3-bar-item" update={this.props.update} commentId={this.state.id}/>: null}
            
          </CardActions>
        </Card>
      </div>
    );
  }
}
Comment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Comment);