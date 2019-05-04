import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  bkg: {
  	backgroundImage: 'url("./tigerteamsbackground.png")',
  	minHeight: '500px',
  	backgroundAttachment: 'fixed',
  	backgroundPosition: 'center',
  	backgroundRepeat: 'no-repeat',
  	backgroundSize: 'cover',
  },
});

class BackgroundImage extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
    }
  }


  render () {

  	const { classes } = this.props;

	return (

      <div className={classes.bkg} >

      </div>
    );
  }
}

export default withStyles(styles)(BackgroundImage);

