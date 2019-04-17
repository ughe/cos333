import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdeaCard from './Card/Card';
import Button from '@material-ui/core/Button';



const styles = theme => ({
	discussion: {
		margin: 'auto',
		backgroundColor: 'red',
		minWidth: '200px',
		minHeight: '50px',
	},
});


class Discussion extends React.Component {
	constructor(props) {
    	super(props)
    	this.close = this.close.bind(this)
    	this.state = {
      
    	}
  	}

  	close = (event) => {
  		this.props.close();
  	}

  	render () {

  		const { classes } = this.props;

  		return (
  			<div className={classes.discussion}>
  				<p>COMMENT PAGE</p>
  				<Button onClick={this.close}> Close Discussion </Button>
  				<p>Idea {this.props.idea}</p>
  			</div>
  		);
  	}

}

Discussion.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Discussion);