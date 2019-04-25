import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';



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



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
    window.location.assign('/login');
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {

    const { classes } = this.props;

    return (
      <MuiThemeProvider theme={theme}>

            <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"/>

        <Button variant="contained" color="white" className={classes.button} onClick={this.handleClickOpen}>
                Login
				<i class="material-icons">
					person_outline
				</i>

        </Button>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(Login);

