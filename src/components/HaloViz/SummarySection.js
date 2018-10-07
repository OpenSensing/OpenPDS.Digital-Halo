/**
 * Created by mpio on 26/10/16.
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Segment} from 'semantic-ui-react';
/* global d3 */


//TODO: remove the Axis example component


const SummarySection = ({title, viz, who}) => {
	const profile = JSON.parse(window.localStorage.getItem('currentProfile'))[who];

	who = who === 'full' ? 'Our app' : who;
    const {race_US, gender, age, income, education, kids} = allTopCategories(profile);
	return (
        <Segment inverted as="section" id='summarySection' style={{"padding-bottom": "2em"}}>
            <h3>{title}</h3>
            <p>{who} suspects that you are a {education} educated {race_US} {gender}, in the {age} age group
                with{kids ? '' : 'out'} children and household income around {income}.
            </p>
        </Segment>
    );
};



function topCategory(data) {
	let values = Object.values(data);
	let keys   = Object.keys(data);
	return keys[values.indexOf(d3.max(values))];
}
function allTopCategories(data) {
    let res = {};
	Object.entries(data).forEach(([grName, cats]) => {
        res[grName] = topCategory(cats)
    });

	return res;
}



export default SummarySection;

