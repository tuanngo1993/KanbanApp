import React, { Component, PropTypes } from 'react';
import marked from 'marked';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import CheckList from './CheckList';

class Card extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showDetails: false
		};
	}

	handleClick() {
		this.setState({
			showDetails: !this.state.showDetails
		});
	}

	render() {
		let cardDetails = <div className="card__details">
			<span dangerouslySetInnerHTML={{__html:marked(this.props.description)}} />
			<CheckList
				cardId={this.props.id}
				tasks={this.props.tasks}
				taskCallbacks={this.props.taskCallbacks}
			/>
		</div>;

		let sideColor = {
			position: 'absolute',
			zIndex: -1,
			top: 0,
			bottom: 0,
			left: 0,
			width: 7,
			backgroundColor: this.props.color
		};

		const titleClassName= [
			"card__title",
			this.state.showDetails ? "card__title--is-open" : undefined
		].join(" ");

		return (
			<div className="card">
				<div style={sideColor} />
				<div className={titleClassName} onClick={this.handleClick.bind(this)}>
					{this.props.title}
				</div>
				<ReactCSSTransitionGroup
					transitionName="toggle"
					transitionEnterTimeout={250}
					transitionLeaveTimeout={250}
				>
					{this.state.showDetails ? cardDetails : <noscript/>}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

Card.propTypes = {
	id: PropTypes.number,
	title: PropTypes.string,
	description: PropTypes.string,
	color: PropTypes.string,
	tasks: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object
}

module.exports = Card;