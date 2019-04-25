import { createMuiTheme } from '@material-ui/core/styles';

const theme =  createMuiTheme({
	typography: {
    	useNextVariants: true,
    	suppressDeprecationWarnings: true,
  },
  	palette: {
    	primary: {main: '#01BAEF'}, // blue
    	secondary: {main: '#FF5900'},  // orange
    	white: {main: '#FBFBFF'}, // ghost white
    	lightgray: {main: '#D3D3D3'}, // light gray
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
