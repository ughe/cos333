import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
/*import CardMedia from '@material-ui/core/CardMedia';*/
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Comment from './comment.svg';


const sampleData = {"Item": {
        '_id'       : {'S': "0"},
        'netid'     : {'S': "aboppana"},
        'title'     : {'S': "Database Title"},
        'content'   : {'S': "This is a description. This is a description from the database"},
        'photo_url' : {'S': "blank"},
        'category'  : {'S': "Entreprenuership"},
        'comments'  : {'SS' : ["a", "b"]},
        'score'     : {'S': '3'},
        'timestamp' : {'S' : "avi"},
      }
};

let titles = sampleData["Item"]["title"]["S"];
let descriptions = sampleData["Item"]["content"]["S"];
let scores = sampleData["Item"]["score"]["S"];


const styles = theme => ({
  card: {
    maxWidth: '500px',
    minWidth: '250px',
    [theme.breakpoints.down('sm')]: {
      margin: '10px 2px 2px',
    },
    margin: '10px 10px',
    display: 'inline-block',
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  upvote: {
    color: 'green',
  },
  downvote: {
    color: 'red',
  },
  score: {
    marginLeft: '5px',
    maxWidth: '50px',
    textAlign: 'center',
  },
  buttonMsg: {
    color: '#123456',
    marginLeft: 'auto',
  },
});


class IdeaCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      description: this.props.description,
      score: this.props.score,
    }
  }

  render () {

    const { classes } = this.props;

    return (
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

          <IconButton className={classes.buttonMsg} aria-label="comment">
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

