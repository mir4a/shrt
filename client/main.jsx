import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import styles from './main.css.json';

console.log(styles);

import App from '../imports/ui/App.jsx';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
