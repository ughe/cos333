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
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    marginTop: '30px',
  },
  replyCard:{
    maxWidth: '400px',
    margin: '0 auto',
    marginTop: '10px',
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
        net_votes: "",
        author: "",
        id: "",
        ideaId: "",
        commentId: "",
        open: false,
        expanded: true,
      }

      this.state.content = this.props.content;
      this.state.net_votes = this.props.net_votes;
      this.state.author = this.props.author;
      this.state.id = this.props.id;
      this.state.ideaId = this.props.ideaId;
      this.state.commentId = this.props.commentId;
    }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleReply = (event) => {

  }

  render() {
    const { classes } = this.props;

    let isTopLevel = (this.state.ideaId !== null);

    if(this.state.author === null)
    {
      this.state.author = 'No author';
    }

    return (
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
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>

          {isTopLevel ? <NewCommentReply className="w3-bar-item" update={this.update} commentId={this.state.id}/>: null}
          
        </CardActions>
      </Card>
    );
  }
}
Comment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Comment);