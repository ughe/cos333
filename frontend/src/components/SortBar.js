import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import MuiThemeProvider from '@material-ui/core/styles';
import theme from '../theme';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';



const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});


class SortBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (keyWord) => {
    this.setState({ anchorEl: null });
  };

  handleFiltered = (keyWord) => {
    this.setState({ anchorEl: null });

    let request = '';

    if(keyWord === 'all')
    {
      request = '/api/get/idea';
    } else {
      request = '/api/get/idea/tag/' + keyWord;
    }

    console.log(request);

    fetch(request)
    .then(results => {
      return results.json();
    }).then(data => {

      let fetchedData = []
      for(var i = 0; i < data.length; i++)
      {

        let randomIdea = {
          title: data[i]["title"],
          description: data[i]["content"],
          net_votes: data[i]["net_votes"],
          photo_url: data[i]["photo_url"],
        };

        if(keyWord === 'all')
        {
          randomIdea.id = data[i]["id"];
        } else {
          randomIdea.id = data[i]["tags"][0]["ideaId"];
        }



        fetchedData = [randomIdea,...fetchedData];

      }

      this.props.filter(fetchedData);

    });
  };

  render() {

    const { classes } = this.props;
    const { anchorEl } = this.state;


    return (
      <MuiThemeProvider theme={theme}>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <Button aria-owns={anchorEl ? 'simple-menu' : undefined} aria-haspopup="true" variant="contained" color="primary" className={classes.button} onClick={this.handleClick}>
                Filter Ideas
              <i className="material-icons rightIcon">
                sort
              </i>
        </Button>


        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
          <MenuItem onClick={() => {this.handleFiltered('entreprenuership')}} >Entrepreneurship</MenuItem>
          <MenuItem onClick={() => {this.handleFiltered('club')}}>Clubs</MenuItem>
          <MenuItem onClick={() => {this.handleFiltered('initiative')}}>Initiatives</MenuItem>
          <MenuItem onClick={() => {this.handleFiltered('shower thought')}}>Shower Thoughts</MenuItem>
          <MenuItem onClick={() => {this.handleFiltered('all')}}>All</MenuItem>
        </Menu>
      </MuiThemeProvider>

    );
  }
}

export default withStyles(styles)(SortBar);
