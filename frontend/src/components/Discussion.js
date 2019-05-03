import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdeaCard from './Card/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import Comment from "./Comment"
import NewComment from "./NewComment"
import Interested from "./Interested"
import "../w3.css";


const styles = theme => ({
	card: {
		margin: '10px auto',
		backgroundColor: "",
		maxWidth: '1000px',
  },
  reply: {
    margin: '0 auto',
    backgroundColor: "",
    maxWidth: '2000px',
    margin: '10px 2px 2px',
    width: "99%",
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


class Discussion extends React.Component {
	constructor(props) {
    	super(props)
    	this.close = this.close.bind(this)
      this.update = this.update.bind(this)
      this.componentDidMount = this.componentDidMount.bind(this);
      this.addInterest = this.addInterest.bind(this);
      this.del = this.del.bind(this)
      this.state = {
        title: null,
        description: null,
        net_votes: null,
        photo_url: null,
        id: this.props.idea,
        commentList: [],
        voteDirecton: null,
        author: "",
      }
  	}

  	close = (event) => {
  		this.props.close();
  	}

    addInterest = (event) => {
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
            ideaId: this.state.id,
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
    }

    update(){
      var topLevelIds = [];

      fetch('/api/get/idea/' + this.state.id)
      .then(results => {
        return results.json();
      })
      .then(data => {
        var fetchedData = [];
        let self = this;
        for(var i = 0; i < data[0]["comments"].length; i++)
        {
          let voteDirectionTopComment = null;
          if(data[0]["comments"][i]["votes"] && data[0]["comments"][i]["votes"].length > 0)
          {
            voteDirectionTopComment = data[0]["comments"][i]["votes"][0]["is_upvote"];
          }

          var topLevelComment = {
            content: data[0]["comments"][i]["content"],
            net_votes: data[0]["comments"][i]["net_votes"],
            author: data[0]["comments"][i]["userNetid"],
            id: data[0]["comments"][i]["id"],
            ideaId: data[0]["comments"][i]["ideaId"],
            commentId: data[0]["comments"][i]["commentId"],
            voteDirection: voteDirectionTopComment,
          };

          fetchedData = [...fetchedData, topLevelComment];

          for(var j = 0; j < data[0]["comments"][i]["comments"].length; j++)
          {
            var replyComment = {
              content: data[0]["comments"][i]["comments"][j]["content"],
              net_votes: data[0]["comments"][i]["comments"][j]["net_votes"],
              author: data[0]["comments"][i]["comments"][j]["userNetid"],
              id: data[0]["comments"][i]["comments"][j]["id"],
              ideaId: data[0]["comments"][i]["comments"][j]["ideaId"],
              commentId: data[0]["comments"][i]["comments"][j]["commentId"],
            };

            fetchedData = [...fetchedData, replyComment];
          }

        }
        
        self.setState({
          commentList: fetchedData
        });
      });
    }

    componentDidMount() {

      var topLevelIds = [];

      fetch('/api/get/idea/' + this.state.id)
      .then(results => {
        return results.json();
      })
      .then(data => {
        
        var fetchedData = [];
        let self = this;
        for(var i = 0; i < data[0]["comments"].length; i++)
        {
          
          let voteDirectionTopComment = null;
          if(data[0]["comments"][i]["votes"] && data[0]["comments"][i]["votes"].length > 0)
          {
            voteDirectionTopComment = data[0]["comments"][i]["votes"][0]["is_upvote"];
          }
          

          var topLevelComment = {
            content: data[0]["comments"][i]["content"],
            net_votes: data[0]["comments"][i]["net_votes"],
            author: data[0]["comments"][i]["userNetid"],
            id: data[0]["comments"][i]["id"],
            ideaId: data[0]["comments"][i]["ideaId"],
            commentId: data[0]["comments"][i]["commentId"],
            voteDirection: voteDirectionTopComment,
          };

          fetchedData = [...fetchedData, topLevelComment];

          for(var j = 0; j < data[0]["comments"][i]["comments"].length; j++)
          {
            var replyComment = {
              content: data[0]["comments"][i]["comments"][j]["content"],
              net_votes: data[0]["comments"][i]["comments"][j]["net_votes"],
              author: data[0]["comments"][i]["comments"][j]["userNetid"],
              id: data[0]["comments"][i]["comments"][j]["id"],
              ideaId: data[0]["comments"][i]["comments"][j]["ideaId"],
              commentId: data[0]["comments"][i]["comments"][j]["commentId"],
            };

            fetchedData = [...fetchedData, replyComment];
          }

        }

        let voteDirection = null;
        if(data[0]["votes"] && data[0]["votes"].length > 0)
        {
          voteDirection = data[0]["votes"][0]["is_upvote"];
        }

        self.setState({
          commentList: fetchedData,
          title: data[0]["title"],
          description: data[0]["content"],
          net_votes: data[0]["net_votes"],
          photo_url: data[0]["photo_url"],
          voteDirection: voteDirection,
          author: data[0]["userNetid"]
        });

      });

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

    del() {
      this.componentDidMount();
    }

  	render () {

  		const { classes } = this.props;

      var elements = this.state.commentList.map((item, id) => <Comment key={item.id} content={item.content} net_votes={item.net_votes} author={item.author} id={item.id} ideaId={item.ideaId} commentId={item.commentId} voteDirection={item.voteDirection} user={this.props.user} update={this.update} del={this.del}/>);

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
        <React.Fragment>

  			<Card className={classes.card}>

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

              

              <NewComment className="w3-bar-item" update={this.update} idea={this.state.id}/>

              <Button onClick={this.addInterest} idea={this.state.id}> Im Interested </Button>
              <Interested className="w3-bar-item" ideaId={this.state.id}/>
              <IconButton className={classes.buttonMsg} aria-label="close" onClick={this.close}>
                <i className="material-icons">close</i>
              </IconButton>
            </CardActions>

  			</Card>
        {elements}
        </React.Fragment>

  		);
  	}

}

Discussion.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Discussion);