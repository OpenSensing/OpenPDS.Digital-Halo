function showCookieJar (trackerCounts, callback) {

	var diameter = 400,
	    format = d3.format(",d")
	    margin = 4;

	var pack = d3.layout.pack()
	    .size([diameter - margin, diameter - margin])
	    .value(function(d) { return Math.sqrt(d.count); });

	var cookieJar = d3.select('#cookies-container').append('svg')
		.attr('width', diameter)
		.attr('height', diameter)
	  .append('g')
	  	.attr('transform', 'translate(2,2)')



	var node = cookieJar.datum(trackerCounts).selectAll(".node")
	  .data(pack.nodes)
	.enter().append("g")
	  .attr("class", function(d) { return d.parent ? d.children ? "node" : "leaf node" : "root node"; })
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

	node.append("title")
	  .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

	node.append("circle")
	  .attr("r", function(d) { return d.r; });

	node.filter(function(d) { return !d.children; }).append("text")
	  .attr("dy", ".3em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return d.name.substring(0, d.r / 3); });


	d3.select(self.frameElement).style("height", diameter + "px");

	callback()
}

module.exports = showCookieJar;