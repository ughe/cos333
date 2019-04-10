import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme =  createMuiTheme({
  palette: {
    primary: {main: '#01BAEF'}, // bring blue
    secondary: {main: '#FF5900'},  // bring orange

  }
});

export default theme;