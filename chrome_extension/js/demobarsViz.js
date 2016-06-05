
/*$().ready(function () {
	// var demoData = {"No_Kids": [0.0004976500535313772, 0.9901725545484045], "Has_Kids": [4.939168160739121e-06, 0.009827445451595519]}
	var demoData = {"25_34": [6.970938580771711e-09, 0.8170555343755908], "18": [8.707129343999997e-16, 1.0205524172401663e-07], "55_64": [1.2401793332096016e-15, 1.4535996495682205e-07], "65": [1.8063360000000005e-22, 2.1171852378858317e-14], "18_24": [3.814542333984374e-13, 4.470980326363578e-05], "45_54": [2.2609477504283447e-11, 0.0026500303381198566], "35_44": [1.5378490053151941e-09, 0.1802494780677979]};
	var showDemoBarchart = showDemoBarchartFactory(350, 120)

	// var selectedSVG = d3.select('svg#gen-bars');
	var demographicCatGroups = [ 'gender',
								 'age',
								 'income',
								 'education',
								 'kids']
	  , demoData  = parseDemographicCategoriesData(demoData)
	  , barcharts = d3.selectAll('.demographic-bars')
		.data(demographicCatGroups)
		.call(function (selectedSVG) { showDemoBarchart(selectedSVG, demoData); });
	


	$('[alt="The Cookie Jar or other trackers visualization"]').click(function () {
		var selectedSVG = d3.select('svg#gen-bars');
		showDemoBarchart(selectedSVG, parseDemographicCategoriesData({"25_34": [6.970938580771711e-09, 0.3170555343755908], "18": [8.707129343999997e-16, 0.715], "55_64": [1.2401793332096016e-15, 1.4535996495682205e-02], "65": [1.8063360000000005e-22, 2.1171852378858317e-14], "18_24": [3.814542333984374e-13, 4.470980326363578e-05], "45_54": [2.2609477504283447e-11, 0.0026500303381198566], "35_44": [1.5378490053151941e-09, 0.1802494780677979]}));
	})

})*/

/*$().ready(function () {
var trackerData = {"kids": {"No_Kids": [0.0004976500535313772, 0.9901725545484045], "Has_Kids": [4.939168160739121e-06, 0.009827445451595519]}
, "race_US": {"Hispanic": [1.8790481920000006e-15, 1.6320598008442476e-13], "Asian": [1.5832967439974402e-12, 1.3751829142473676e-10], "Caucasian": [0.011513353804617045, 0.9999999998623053], "African_American": [1.5237476351999994e-16, 1.3234611398627734e-14]}, 
"gender": {"Male": [0.00635286095045162, 0.9999986016843961], "Female": [8.883317018016102e-09, 1.398315603886119e-06]}, 
"age": {"25_34": [6.970938580771711e-09, 0.8170555343755908], "18": [8.707129343999997e-16, 1.0205524172401663e-07], "55_64": [1.2401793332096016e-15, 1.4535996495682205e-07], "65": [1.8063360000000005e-22, 2.1171852378858317e-14], "18_24": [3.814542333984374e-13, 4.470980326363578e-05], "45_54": [2.2609477504283447e-11, 0.0026500303381198566], "35_44": [1.5378490053151941e-09, 0.1802494780677979]}, 
"income": {"150k": [1.1185158027685233e-09, 1.0], "100-150k": [0.0, 0.0], "0-50k": [0.0, 0.0], "50-100k": [0.0, 0.0]}, 
"education": {"Grad_School": [1.6761600414734138e-07, 0.0006485746684215066], "No_College": [2.982154895677569e-11, 1.1539173317515996e-07], "College": [0.00025826983609952787, 0.9993513099398453]}}

	updateBarcharts('xxx.com', trackerData)
})
*/

function updateBarcharts (trackerName, trackerData) {
	/*	
	nput: Dictionary of categories with follwoing keys gender, age, income, education, kids
	Outpu: Title-tracker name(cookie monster image later) and all barcharts updated with new data
	*/
    //*****************************   TODO
	d3.selectAll('.tracker-name')
		.html(trackerName)

	var demographicCatGroups = [ 'gender',
								 'age',
								 'income',
								 'education',
								 'kids']	

	var showDemoBars = showDemoBarchartFactory(350, 120)

  	for (var i in demographicCatGroups) {
  		var category    = demographicCatGroups[i]
  		  , svgSelector = '.demographic-bars.' + category
  		  , data        = parseDemographicCategoriesData(trackerData[category])
  		  , selectedSVG = d3.select(svgSelector);

  		showDemoBars(selectedSVG, data);
  	}
}



function showDemoBarchartFactory(svgWidth, svgHeight) {

	return function showDemographicsBarchart (selectedSVG, groupData, delayDuration) {
		/*
		slectedSVG: d3 selection of the SVG element to be filled out or modified
		groupData: Array of 2 element arrays. Sub arrays consist of category name and p-value e.g [college, 0.07]
		delayDuration: optional variable for the duration of the delay of transition to cascade through vis
		*/
		svgWidth <= 300 ? svgWidth = 300 : svgWidth = svgWidth;
		delayDuration = delayDuration || 0;
		selectedSVG.attr('width', svgWidth);
		selectedSVG.attr('height', svgHeight);
		
		var padding  = {top: 10, right: 0, bottom: 20, left: 40}
		  , w        = svgWidth  - padding.right          //  width as x distance from the origin - top left corner
		  , h        = svgHeight - padding.bottom         //  height as y distance from the origin - top left corner
		  , barWidth = 20;

		var yScale = d3.scale.linear()
			.domain([0, 1])  // try change it to [0, max(groupData[n][1])]
			.range([h, padding.top]);

		var categories 		   = $.map(groupData, function (d) {return d[0]})
		  , realWidth          = w - padding.left
		  , totalInterbarSpace = realWidth - categories.length * barWidth
		  , interbarWidth      = totalInterbarSpace / (categories.length);
		 function myXScale (cat) { 
		 	var index = categories.indexOf(cat);
		 	return padding.left + index * barWidth + index * interbarWidth + 0.5 * interbarWidth;
		};	 

		var topCatIndex = topCategoryIndex(groupData);


		// bars work
		var bars = selectedSVG.selectAll('rect')
			.data(groupData);

		var barsEnter = bars.enter()
			.append('rect')
			.attr('x', function (d) {return myXScale(d[0])}) // start pixel of d[0] category name
			.attr('y', function (d) {return yScale(d[1])})
			.attr('height', function (d) {return h - yScale(d[1])})
			// .attr('width', xScale.rangeBand())
			.attr('width', barWidth)
			.attr('fill', 'hsl(0, 0%, 41%)')
	
		
		bars.transition()
			.duration(2000)
			.delay(delayDuration)
			.attr('y', function (d) {return yScale(d[1])})
			.attr('height', function (d) {return h - yScale(d[1])})
			.attr('fill', 'hsl(0, 0%, 41%)')
			.filter(function (d, i) {return i == topCatIndex})
			.attr('fill', 'hsl(0, 25%, 52%)');


		bars.exit().remove()

		//axes work

		var yAxis = d3.svg.axis()
			.orient('left')
			.scale(yScale)
			.ticks(3)
			.tickFormat(d3.format('%'));

		if (selectedSVG.selectAll('g.y-axis')[0].length == 0)  {   // if no y-axis present, append
			var yCoord = padding.left + 10;
			selectedSVG.append('g')
				.attr('transform', 'translate(' + yCoord + ',0)')
				.classed('axis', true)
				.classed('y-axis', true)
				.call(yAxis);
		}

		if (selectedSVG.selectAll('g.x-axis')[0].length == 0)  {   // if no x-axis present, append
			var myXAxis = selectedSVG.append('g')
				.classed('axis', true)
				.classed('x-axis', true)
				.attr('transform', 'translate(0,' + svgHeight + ')')
		} 

//NOT USING d3.scale for x to be able to keep the width of bars constant

		var myXAxisLabels = selectedSVG.select('g.x-axis').selectAll('text')
			.data(categories)

		var myXAxisLabelsEnter = myXAxisLabels.enter().append('text')
			.attr('x', function (d) {return myXScale(d) + barWidth/2})
			.attr('text-anchor', 'middle')
			.text(function (d) {return d})

		myXAxisLabels.transition()
			.duration(2000)
			.delay(delayDuration)
			.attr('font-weight', 'normal')
			.transition()
			.duration(2000)
			.filter(function (d, i) {return i == topCatIndex})
			.attr('font-weight', 'bold')
		
	}
}

function parseDemographicCategoriesData (dataObj) {
	// parse a demogroup obj to array of structure [[cat_name1, percentage1], ...]
	//dataArray = typeof(dataObj) == 'object' ? $.map(dataObj, function (val, key) {return [[key, val[1]]]})
	dataArray = typeof(dataObj) == 'object' ? $.map(dataObj, function (val, key) {return [[key, val]]})
		: dataObj
	return dataArray;
}

function topCategoryIndex (data) {
	var temp_flat_data = $.map(data, function (d) {return d[1]})

	return temp_flat_data.indexOf(d3.max(temp_flat_data))
}
