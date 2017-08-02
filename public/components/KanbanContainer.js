import React, { Component, PropTypes } from 'react';
import 'babel-polyfill';
import update from 'react-addons-update';

import KanbanBoard from './KanbanBoard';
``
// If you're running the server locally, the URL will be, by default, localhost:3000
// Also, the local server doesn't need an authorization header.
const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
	'Content-Type': 'application/json',
	Authorization: 'any-string-you-like'// The Authorization is not needed for local server
};

class KanbanContainer extends Component {
	constructor() {
		super(...arguments);
		this.state={
			cards: []
		};
	}

	componentDidMount(){
		fetch(API_URL+'/cards', {headers: API_HEADERS})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({cards: responseData});
		})
		.catch((error) => {
			console.log('Error fetching and parsing data', error);
		});
	}

	addTask(cardId, taskName) {
		// Find the index of the card
		let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

		// Create a new task with the given name and a temporary ID
		let newTask = {
			id: Date.now(),
			name: taskName,
			done: false
		};

		let newState = update(this.state.cards, {
			[cardIndex] : {
				tasks: {$push: [newTask]}
			}
		});

		// set the component state to the mutated object
		this.setState({ cards: newState });
	}

	deleteTask(cardId, taskId, taskIndex) {
		// Find the index of the card
		let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

		// Create a new object without the task
		let newState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {$splice: [[taskIndex,1]]}
			}
		});

		console.log(newState);

		// set the component state to the mutated object
		this.setState({ cards: newState });

		// Call the API to remove the task on the server
		// fetch('${API_URL}/cards/${cardId}/tasks/${taskId}', {
		// 	method: 'delete',
		// 	headers: API_HEADERS
		// });
	}

	toggleTask(cardId, taskId, taskIndex) {
		// Find the index of the card
		let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

		// Save a reference to the task's 'done' value
		let newDoneValue;

		// Using the $apply command, you will change the done value to its opposite
		let newState = update(this.state.cards, {
			[cardIndex]: {
				tasks: {
					[taskIndex]: {
						done: {
							$apply: (done) => {
								newDoneValue = !done
								return newDoneValue;
							}
						}
					}
				}
			}
		});

		// set the component state to the mutated object
		this.setState({ cards: newState });

		// Call the API to toggle the task on the server
		// fetch('${API_URL}/cards/${cardId}/tasks/${taskId}', {
		// 	method: 'put',
		// 	headers: API_HEADERS,
		// 	body: JSON.stringify({done:newDoneValue})
		// });
	}

	updateCardStatus(cardId, listId) {
		// Find the index of the card
		let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

		// Get the current card
		let card = this.state.cards[cardIndex];

		// Only proceed if hovering over a different list
		if(card.status !== listId) {
			// Set the component state to the mutated object
			this.setState(update(this.state, {
				cards: {
					[cardIndex]: {
						status: { $set: listId }
					}
				}
			}));
		}
	}

	updateCardPosition(cardId, afterId) {
		// Only proceed if hovering over a different card
		if(cardId !== afterId) {
			// Find the index of the card
			let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);

			// Get the current card
			let card = this.state.cards[cardIndex];

			// Find the index of the card the user is hovering over
			let afterIndex = this.state.cards.findIndex((card) => card.id === afterId);

			// Use splice to remove the card and reinsert it a new index
			this.setState(update(this.state, {
				cards: {
					$splice: [
						[cardIndex, 1],
						[afterIndex, 0, card]
					]
				}
			}));
		}
	}

	render() {
		return (
			<KanbanBoard
				cards={this.state.cards}
				taskCallbacks={{
					toggle: this.toggleTask.bind(this),
					delete: this.deleteTask.bind(this),
					add: this.addTask.bind(this)
				}}
				cardCallbacks={{
					updateStatus: this.updateCardStatus.bind(this),
					updatePosition: this.updateCardPosition.bind(this)
				}}
			/>
		);
	}
}

module.exports = KanbanContainer;