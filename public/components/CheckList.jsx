import React, { Component, PropTypes } from 'react';

class CheckList extends Component {
	checkInputKeyPress(event) {
		if(event.key === "Enter") {
			this.props.taskCallbacks.add(this.props.cardId, event.target.value);
			event.target.value = "";
		}
	}

	render() {
		let tasks = this.props.tasks.map((task, index) =>
			<li className="checklist__task" key={task.id}>
				<input
					type="checkbox"
					checked={task.done}
					onChange={this.props.taskCallbacks.toggle.bind(null, this.props.cardId, task.id, index)}
				/>
				{task.name}
				<a
					href="#"
					className="checklist__task--remove"
					onClick={this.props.taskCallbacks.delete.bind(null, this.props.cardId, task.id, index)}
				/>
			</li>
		);

		return (
			<div className="checklist">
				<ul>{tasks}</ul>
				<input
					type="text"
					className="checklist--add-task"
					placeholder="Type and hit Enter to add a task"
					onKeyPress={this.checkInputKeyPress.bind(this)}
				/>
			</div>
		);
	}
}

CheckList.propTypes = {
	tasks: PropTypes.arrayOf(PropTypes.object),
	taskCallbacks: PropTypes.object,
	cardId: PropTypes.number
}

module.exports = CheckList;