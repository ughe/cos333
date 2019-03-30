import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Card.css';


class Card extends Component {

  	render() {
		return (
			<div className="Card"> 
				<header>
					<h1>{this.props.message}</h1>
				</header>
				<button> Hello </button>
			</div>
	);
  }
}

Card.propTypes = {
	message: PropTypes.string
}

Card.defaultProps = {
	message: 'Default'
}

export default Card;
