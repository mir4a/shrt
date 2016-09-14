import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames';

import { Tasks } from '../api/tasks';

import mainStyles from '/client/main.css.json';
import todoStyles from '/client/css/todo.css.json';

// Task component - represents a single todo item
export default class Task extends Component {

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }

  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    const taskClassName = classnames([
      {
        [`${todoStyles.checked}`]: this.props.task.checked,
        [`${todoStyles.private}`]: this.props.task.private,
      },
      todoStyles['task-item'],
    ]);

    return (
      <li className={taskClassName}>
        <button className={todoStyles.delete} onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />

        { this.props.showPrivateButton ? (
          <button className={mainStyles['toggle-private']} onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className={todoStyles.text}>
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
}

Task.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  task: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};
