import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
    const tasksOwner = Tasks.findOne(taskId).owner;
    if (tasksOwner && this.userId !== tasksOwner) {
      throw new Meteor.Error('not-authorized');
    };

    Tasks.remove(taskId);
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    const tasksOwner = Tasks.findOne(taskId).owner;
    if (tasksOwner && this.userId !== tasksOwner) {
      throw new Meteor.Error('not-authorized');
    };

    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);

    const taskOwner = Tasks.findOne(taskId).owner;

    // Make sure only the task owner can make a task private
    if (taskOwner && taskOwner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, { $set: { private: setToPrivate } });
  },
});
