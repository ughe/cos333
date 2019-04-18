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

const styles = theme => ({
	card: {
		margin: 'auto',
		backgroundColor: "",
		maxWidth: '2000px',
    margin: '5px 5px 5px',
    width: 'calc(100% - 10px)',
  },
  reply: {
    margin: 'auto',
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
      this.state = {
        title: "",
        description:"",
        net_votes: "",
        photo_url: "",
        id: "",
        open: false
      }
  	}

  	close = (event) => {
  		this.props.close();
  	}

    componentDidMount() {
      var url = '/api/get/idea/' + this.props.idea

      fetch(url)
      .then(results => {
        return results.json();
      }).then(data => {

        let random = JSON.stringify(data);


        this.setState({
          title: data[0]["title"],
          description: data[0]["content"],
          net_votes: data[0]["net_votes"],
          photo_url: data[0]["photo_url"],
          id: data[0]["id"],

        });

      });

    }



  	render () {



  		const { classes } = this.props;

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
        
        <div>
          <Comment className = "reply"/>
        </div>

        <div>
          <Comment className = "reply"/>
        </div>
        <div>
          <Comment className = "reply"/>
        </div>
                <div>
          <Comment className = "reply"/>
        </div>
                <div>
          <Comment className = "reply"/>
        </div>
        </React.Fragment>

  		);
  	}

}

Discussion.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Discussion);