/**
 * Created by mpio on 25/10/16.
 */
import React, {Component} from 'react';
import * as d3 from 'd3';
import D3Chart from '../D3Chart';
import d3BlackboxFactory from '../d3BlackboxFactory';


const d3Render = function showCookieJar () {

    const {anchor}        = this.refs
        , diameter        = this.props.width
        , trackerPackFeed = this.props.data
        , { companyList, trackerList, onClick } = this.props;

    var format = d3.format(",d");
    const margin = 4;

    var pack = d3.layout.pack()
        .size([diameter - margin, diameter - margin])
        .value(function(d) { return Math.sqrt(d.count); });


    var cookieJar = d3.select(anchor);

    cookieJar.selectAll(".node").remove();

    var node = cookieJar.datum(trackerPackFeed).selectAll(".node")
        .data(pack.nodes)
        .enter().append("g")
        .attr("class", function(d) { return d.parent ? d.children ? "node" : "leaf node" : "root node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

    node.append("circle")
        .attr("r", function(d) {  return d.r; });

    node.filter(function(d) { return !d.children; }).append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.name.substring(0, d.r / 3); });


    //d3.selectAll(".node").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    //d3.selectAll('circle').attr('r', d=>d.r )


    d3.select(self.frameElement).style("height", diameter + "px");

// TODO: below call not present in the newest commit merged in, verify validity
	var leaves = d3.select('#cookie-section').selectAll('.leaf');

	leaves.on('click', onClick);


	d3.select(anchor).selectAll('.node:not(.leaf):not(.root)')
        .on('click', onClick);

	var root = d3.select('#cookie-section').selectAll('.root');
	root.on('click', onClick);


	console.log('cookieChart')


};

const Cookies = d3BlackboxFactory(d3Render);

class CookieChart extends Component {

    makePackFeed(trackerCounts) {

        const packFeed = {
			name: 'Tracking Companies',
			children: trackerCounts.sort((a, b) => {
				if (a.count > b.count) return -1;
				if (a.count < b.count) return 1;
				return 0
			}).slice(0, 20)
		}
		/*const min_count = 50; // trim out  the small tracker to prevent from cluttering
		 for (var i in trackerCounts) {
		 if (trackerCounts[i].count >= min_count) packFeed['children'].push(trackerCounts[i]);
		 }*/

        return packFeed;
    }


    render () {
        const {trackerList, trackerCounts, companyList, onClick} = this.props;
        const packFeed = this.makePackFeed(trackerCounts);

        window.packFeed = packFeed;

/*
		var root = d3.select('#cookie-section').selectAll('.root');
		root.on('click', onClick)



        var companies = d3.select('#cookie-section').selectAll('.node:not(.leaf):not(.root)');
		companies.filter(function (d) {return (companyList.indexOf(d.name) > -1)})
			.on('click', onClick);




        //select all the leaves
		var leaves = d3.select('#cookie-section').selectAll('.leaf')
        //extract tracker names from the leaves
        var trackerNameData = []
        leaves.each((d)=>{trackerNameData.push(d.name)})

        //wire onclicks to leaves for which there is demographic data (they exist in Tracker list)
        leaves.data(trackerNameData)
            .filter((trackerName)=> trackerList.indexOf(trackerName) !== -1)  // if tracker name in the data
            .on('click', onClick)
*/


        //wire the 'tray'



        console.log('cookieChart');

        return (
            <div>
                <D3Chart aspectRatio={1}>
                    <Cookies x="2" y="2" data={packFeed} onClick={onClick} />
                </D3Chart>
            </div>
        )
    }
}



export default CookieChart;

