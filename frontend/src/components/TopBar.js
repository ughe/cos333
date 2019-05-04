import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import NewPost from './NewPost';
import SortBar from './SortBar';
import Login from './Login';

import "../w3.css";
import '../App.css';

const styles = theme => ({
});

class TopBar extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		const { classes } = this.props;

		return(

			<div>
				<div className="w3-bar w3-white w3-wide w3-padding w3-card w3-large">
					<a href="#home" className="w3-bar-item w3-button">Tiger<b>TEAMS</b></a>

					<div className="w3-bar-item w3-hide-small w3-right">
					  <Login className="w3-bar-item w3-hide-small w3-right" 
					  isLoggedInFunc= {this.props.handleLogin} 
					  isLoggedIn={this.state.isLoggedIn}/>
					</div>



					<div className="w3-bar-item w3-hide-small w3-right">
						<a href="#about" className="w3-bar-item w3-button">About</a>
					</div>
					
					<form className="w3-bar-item search-container center">
						<input id="search" type="text" id="search-bar" 
						placeholder="..." onChange={this.props.search}/>

					<a href="#"><img className="search-icon" 
						src="http://www.endlessicons.com/wp-content/uploads/2012/12/search-icon.png"/></a>
					</form>
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(TopBar);