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
var ColorHash = require('color-hash');
var colorHash = new ColorHash({saturation: 0.5});

const styles = theme => ({
  contain: {
    maxWidth: '600px',
    margin: '0 auto',
    maxHeight: '300px',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '5px',
    marginBottom: '5px',
    maxHeight: '300px',
    background: 'rgba(255, 255, 255, 0.85)',
  },
  replyCard:{
    maxWidth: '500px',
    marginTop: '5px',
    clear: 'both',
    margin: '0 auto',
    marginRight: '0px',
    marginBottom: '5px',
    maxHeight: '300px',
    background: 'rgba(255, 255, 255, 0.85)',
  },
  header:{
    paddingBottom: '0px',
  },
  upVoteColored: {
    color: 'green',
    display: 'inline-block',
    float: 'left',
  },
  downVoteColored: {
    color: 'red',
    display: 'inline-block',
    float: 'left',
  },
  upVote: {
    display: 'inline-block',
    float: 'left',
  },
  downVote: {
    display: 'inline-block',
    float: 'left',
  },
  net_votes: {
    display: 'inline-block',
    float: 'left',
    marginTop: '12px',
  },
  actions: {
    display: "flex"
  },
  content: {
    marginTop: '0',
    display: 'inline-block',
    float: 'left',
    marginBottom: '0',
    textAlign: 'center',
    paddingTop: '16px',
  },
  buttonDelete: {
    float: 'right',
  },
  buttonDeleteReply: {
    marginRight: '0',
    marginLeft: 'auto',
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
        data["voteDirection"] = (value === 1);
        this.setState(data)
      })
      .catch(err => {
        window.location.assign('/login');
        console.log(JSON.stringify(err));
      });
    });
  }

  delete = (event) => {
    let deleteConfirmed = window.confirm("Are you sure?");
    if(deleteConfirmed)
    {
      fetch('/api/get/comment/' + this.state.id)
      .then(results => {
        return results.json();
      }).then(data => {
        let subCommentIds = data[0]["comments"].map(subComment => subComment.id);

        for(var i = 0; i < subCommentIds.length; i++)
        {
          fetch('/api/del/comment/' + subCommentIds[i]);
        }

        fetch('/api/del/comment/' + this.state.id)
        .then(res => {
          this.props.del();
          alert("Your comment has been deleted.");
        });
      });
    }
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

    let remove = (this.state.author === this.props.user);

    var style1 = {
      marginLeft: 'auto',
      marginRight: '0',
    };

    return (
      <div className={classes.contain}>
        <Card className={isTopLevel ? classes.card : classes.replyCard}>
          <CardHeader
            className={classes.header}
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar} style={{backgroundColor: colorHash.hex(this.props.author)}}>
                {this.state.author.substring(0,2).toUpperCase()}
              </Avatar>
            }
            
            

            title={this.props.author}
            subheader="Recently"
            action={
              isTopLevel ? 
              <span>
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
              </span>
              : null
            }
          />
          <CardContent className = {classes.content} align="center">
            <Typography className={classes.content} align="center" component="p">
              {this.props.content}
            </Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            
            {isTopLevel ? <NewCommentReply className="w3-bar-item" style={style1} update={this.props.update} commentId={this.state.id}/>: null}

            {remove ?
            <IconButton className={isTopLevel ? classes.buttonDelete : classes.buttonDeleteReply} aria-label="delete" onClick={this.delete}>
              <i className="material-icons">
                delete
              </i>
            </IconButton>
            : null}
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