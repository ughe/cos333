import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Comment from "./Comment"
import NewComment from "./NewComment"
import "../w3.css";

const styles = theme => ({
	card: {
		margin: '10px auto',
		backgroundColor: "",
		maxWidth: '1000px',
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


class Discussion extends React.Component {
	constructor(props) {
    	super(props)
    	this.close = this.close.bind(this)
      this.update = this.update.bind(this)
      this.state = {
        title: null,
        description: null,
        net_votes: null,
        photo_url: null,
        id: this.props.idea,
        commentList: [],
      }
  	}

  	close = (event) => {
  		this.props.close();
  	}

    update(){
      console.log("HELLO2");
      this.forceUpdate();
      this.props.refresh(this.state.id);
    }

    componentDidMount() {

      var topLevelIds = [];

      fetch('/api/get/idea/' + this.state.id)
      .then(results => {
        return results.json();
      })
      .then(data => {
        for(var i = 0; i < data[0]["comments"].length; i++)
        {
          topLevelIds = [...topLevelIds, data[0]["comments"][i]["id"]];
        }

        var fetchedData = [];
        var fetches = [];
        let self = this;

        for(var j = 0; j < topLevelIds.length; j++)
        {
          fetches.push(
            fetch('/api/get/comment/' + topLevelIds[j])
            .then(results => {
              return results.json();
            }).then(data => {
              var topLevelComment = {
                content: data[0]["content"],
                net_votes: data[0]["net_votes"],
                author: data[0]["userNetid"],
                id: data[0]["id"],
                ideaId: data[0]["ideaId"],
                commentId: data[0]["commentId"],
              };

              fetchedData = [...fetchedData, topLevelComment];

              for(var k = 0; k < data[0]["comments"].length; k++)
              {
                var replyComment = {
                  content: data[0]["comments"][k]["content"],
                  net_votes: data[0]["comments"][k]["net_votes"],
                  author: data[0]["comments"][k]["userNetid"],
                  id: data[0]["comments"][k]["id"],
                  ideaId: data[0]["comments"][k]["ideaId"],
                  commentId: data[0]["comments"][k]["commentId"],
                };

                fetchedData = [...fetchedData, replyComment];
              }
            })

          );
        }

        Promise.all(fetches).then(function() {
          self.setState({
            commentList: [
            ...self.state.commentList,
            ...fetchedData
            ],
            title: data[0]["title"],
            description: data[0]["content"],
            net_votes: data[0]["net_votes"],
            photo_url: data[0]["photo_url"],
          });
        });
      });

    }

  	render () {



  		const { classes } = this.props;

      var elements = this.state.commentList.map((item, id) => <Comment key={item.id} content={item.content} net_votes={item.net_votes} author={item.author} id={item.id} ideaId={item.ideaId} commentId={item.commentId}/>);

  		return (
        <React.Fragment>
  			<Card className={classes.card} onClick={this.close}>

         <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"/>

          <link href="https://unpkg.com/ionicons@4.5.5/dist/css/ionicons.min.css" rel="stylesheet"/>

            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.state.title}
                </Typography>
                <Typography component="p">
                  {this.state.description}
                </Typography>
              </CardContent>

              <CardMedia
                className={classes.media}
                image= {this.state.photo_url}
                title="Contemplative Reptile"
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

              <IconButton className={classes.buttonMsg} aria-label="comment" >
                <i className="icon ion-md-text"></i>
              </IconButton>
            </CardActions>

  			</Card>
        {elements}
        <NewComment className="w3-bar-item" update={this.update} idea={this.state.id}/>
        </React.Fragment>

  		);
  	}

}

Discussion.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Discussion);
