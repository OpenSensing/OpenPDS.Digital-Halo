/**
 * Created by mieszko on 14/01/2018.
 */
import * as d3 from 'd3';
import d3BlackboxFactory from '../d3BlackboxFactory.js';


// helper
function topCategoryIndex(data) {
	var temp_flat_data = data.map((d) => {
		return d[1]
	});
	return temp_flat_data.indexOf(d3.max(temp_flat_data))
}

const d3Render = function showDemographicBarchart() {

	const {anchor} = this.refs;
	const chart = d3.select(anchor);

	// meta, dimensions, classing
	let {trackerData, width, height, category, barWidth} = this.props;
	barWidth      = barWidth || 20;
	var svgWidth = width,
		svgHeight = height,
		transitionDuration   = 650,
		delayDuration        = 0;

	chart.classed('demographic-bar', true)
		.classed(category, true);

	// create scales
	var padding = {top: 15, right: 0, bottom: 60, left: 40}
		, w = svgWidth - padding.right          //  width as x distance from the origin - top left corner
		, h = svgHeight - padding.bottom;       //  height as y distance from the origin - top left corner


	var yScale = d3.scale.linear()
	//.domain([0, 1])  // try change it to [0, max(trackerData[n][1])]
		.domain([0, d3.max(trackerData.map(i=>i[1])) + 0.1])
		.range([h, padding.top]);

	var categories = trackerData.map((d)=> d[0])
		, realWidth = w - padding.left
		, totalInterbarSpace = realWidth - categories.length * barWidth
		, interbarWidth = totalInterbarSpace / (categories.length);

	const myXScale = (cat) => {
		var index = categories.indexOf(cat);
		return padding.left + index * barWidth + index * interbarWidth + 0.5 * interbarWidth;
	};

	var topCatIndex = topCategoryIndex(trackerData);

	// title
	chart.select('.chart-title').remove();
	chart.append("text")
		.attr("x", realWidth/2 + padding.left)
		.attr("y", padding.top/2 + 1)
		.attr("text-anchor", "middle")
		.style("font-size", "15px")
		.style("text-decoration", "underline")
		.style("font-weight", "bold")
		.classed('chart-title', true)
		.text(category);



	// bars work
	var bars = chart.selectAll('rect')
		.data(trackerData);

	//var barsEnter = bars.enter()
	bars.enter()
		.append('rect')
		.attr('x', function (d) {
			return myXScale(d[0])
		}) // start pixel of d[0] category name
		.attr('y', function (d) {
			return yScale(d[1])
		})
		.attr('height', function (d) {
			return h - yScale(d[1])
		})
		// .attr('width', xScale.rangeBand())
		.attr('width', barWidth)
		.attr('fill', 'hsl(0, 0%, 41%)')

		.filter((d, i)=>i === topCatIndex)
		.attr('fill', 'hsl(0, 25%, 52%)')

		//.attr('x', d=>myXScale(d[0]));

	bars.attr('x', d=>myXScale(d[0]));
	bars.attr('y', d => yScale(d[1]));

	bars.transition()
		.duration(transitionDuration)
		//.attr('y', function (d) {
		//	return yScale(d[1])
		//})
		.attr('height', function (d) {
			return h - yScale(d[1])
		})
		.attr('fill', 'hsl(0, 0%, 41%)')
		.filter(function (d, i) {
			return i === topCatIndex
		})
		.attr('fill', 'hsl(0, 25%, 52%)');

	bars.exit().remove();

	if (chart.selectAll('g.x-axis')[0].length === 0) {   // if no x-axis present, append
		chart.append('g')
			.classed('axis', true)
			.classed('x-axis', true)
			.attr('transform', 'translate(0,' + svgHeight + ')')
	}

//NOT USING d3.scale for x to be able to keep the width of bars constant

	var myXAxisTicksGroup = chart.select('g.x-axis')
		.attr('transform', `translate(0, ${h + padding.bottom /2})`)
		.selectAll('text')
		.data(categories);

	let tickInclination = -40;
	myXAxisTicksGroup.enter().append('text')
		.attr('transform', d=>`translate(${myXScale(d) + barWidth/2}, 0) rotate(${tickInclination})`)
		.attr('text-anchor', 'middle')
		.text(d=>d);

	myXAxisTicksGroup.attr('transform', d=>`translate(${myXScale(d) + barWidth/2}, 0) rotate(${tickInclination})`);

	myXAxisTicksGroup.transition()
		.duration(transitionDuration)
		.delay(delayDuration)
		.style('font-weight', 'normal')
		.style('font-size', 10)
		.transition()
		.duration(transitionDuration)
		.filter(function (d, i) {
			return i === topCatIndex
		})
		.style('font-weight', 'bold')
		.style('font-size', 14);


	// percentage on bar

	if (chart.selectAll('text.badge.topCat')[0].length === 0) {   // if no x-axis present, append
		chart.append('text')
			.classed('badge', true)
			.classed('topCat', true)
			.attr('transform', 'translate(0,' + svgHeight + ')')
	}

	// percentage badge on

	const sumOfCategories = trackerData.map(c=>c[1]).reduce((agg, v )=>agg+v);
	const topCatBadge = chart.select('text.badge.topCat')
		.style('font-face', "Comic Sans MS")
		.transition()
		.duration(transitionDuration)
		.attr('transform', `translate(${myXScale(categories[topCatIndex]) + barWidth/2 + 3 }, ${yScale(trackerData[topCatIndex][1]) - 3})`)
		.attr('text-anchor', 'middle')
		.style('font-size', 9)
		.transition()
		.style('font-size', 13)
		.style('font-weight', 'bold')
		.text(`${Math.round(trackerData[topCatIndex][1] / sumOfCategories * 100)}%`)
		.transition()
		.duration(300)
		.style('font-size', 7)
		.style('font-weight', 'normal')
		.transition()
		.style('font-size', 15)
		.style('font-weight', 'bold')
		.style('visibility', 'hidden');

	// add listener for the badge/bouble

	bars.on('mouseover', null )
		.on('mouseout', null )
		.filter((d, i) => i === topCatIndex )
		.on('mouseover', function () {chart.select('text.badge.topCat').style('visibility', 'visible')})
		.on('mouseout',  function () {chart.select('text.badge.topCat').style('visibility', 'hidden')});

};


const DemographicBar = d3BlackboxFactory(d3Render);



export default DemographicBar;