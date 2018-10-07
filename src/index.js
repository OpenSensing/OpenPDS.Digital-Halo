import './models/computed';  // populate local storage

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './original.css';
import 'semantic-ui-css/semantic.css';


// config


function configExtension () {
	//TODO initialize the storage inf not already
}
configExtension();

ReactDOM.render(
	<App />,
	document.getElementById('root')
);





//TODO: remove below - just for dev

import * as d3 from 'd3';
window.d3 = d3;


import trackerCounts from './compute/model.js';
