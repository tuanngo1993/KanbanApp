import React, { Component, PropTypes } from 'react';
import Card from './Card'

class List extends Component {
	render() {
		let cards = this.props.cards.map((card, index) => {
			return <Card
				id={card.id}
				title={card.title}
				key={index}
				taskCallbacks={this.props.taskCallbacks}
				cardCallbacks={this.props.cardCallbacks}
				description={card.description}
				color={card.color}
				tasks={card.tasks}
			/>
		});

		return (
			<div className="list">
				<h1>{this.props.title}</h1>
				{cards}
			</div>
		);
	}
}

List.propTypes = {
	title: PropTypes.string,
	cards: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object,
	cardCallbacks: PropTypes.object
}

module.exports = List;