import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme =  createMuiTheme({
	typography: {
    	useNextVariants: true,
    	suppressDeprecationWarnings: true,
  },
  	palette: {
    	primary: {main: '#01BAEF'}, // bring blue
    	secondary: {main: '#FF5900'},  // bring orange
    	white: "value", 
  }, 
  	breakpoints: {
  		xs: "0",
 		sm: "600",
 		md: "960",
 		lg: "1280",
 		xl: "1920",
  	}
}); 

export default theme;