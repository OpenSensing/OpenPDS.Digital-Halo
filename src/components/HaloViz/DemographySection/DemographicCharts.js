/**
 * Created by mpio on 04/11/16.
 */
import React, {PropTypes, Component} from 'react';
import D3Chart from '../D3Chart.js';
import DemographicBar from './DemographicBar.js';
import MediaQuery from 'react-responsive';

const parseDemographicCategoriesData = (dataObj) => {
	let dataArray = [];

	//  use Object.keys, and sort

	for (let key in dataObj) {
		if (dataObj.hasOwnProperty(key)) {
			dataArray.push([key, dataObj[key]])
		}
	}

	return dataArray
};



const sortDataKeyesFactory = (group) => {
	let kind = 'alphabetic';
	if (['age', 'income'].includes(group)) kind = 'numerical';
	if ('education' === group)             kind = group;

	return function (v1, v2) {
		switch (kind) {
			case "numerical":
				return  parseInt(v1) - parseInt(v2);
			case "education":												// v1 === College
				return v1 === 'No_College' ? -1 : v1 === 'Grad_School' ? 1 : v2 === 'No_College' ? 1 : -1;
			case "alphabetic":
			default:
				return v1 > v2;
		}
	}
};

class DemographicCharts extends Component {

	parseData (group) {
		const dataObj = this.props.trackerData[group];

		return Object.keys(dataObj)
			.sort(sortDataKeyesFactory(group))
			.map(category => [category, dataObj[category]])
	};

    render() {

        return (
            <div className="chart-container" ref="chartContainer">
                <h2>{this.props.title}</h2>
				<MediaQuery query="(min-width: 1024px)">
					<div>
						<D3Chart aspectRatio={2.5} svgClassName={`demographic-bars`}>
							<DemographicBar category="gender" trackerData={this.parseData("gender")} barWidth={17}/>
							<DemographicBar category="age" trackerData={this.parseData("age")} barWidth={17}/>
						</D3Chart>
						<D3Chart aspectRatio={2.5} svgClassName={`demographic-bars`}>
							<DemographicBar category="income" trackerData={this.parseData("income")} barWidth={17}/>
							<DemographicBar category="education" trackerData={this.parseData("education")} barWidth={17}/>
						</D3Chart>
						<D3Chart aspectRatio={2.5} svgClassName={`demographic-bars`}>
							<DemographicBar category="kids" trackerData={this.parseData("kids")} barWidth={17}/>
							<DemographicBar category="race_US" trackerData={this.parseData("race_US")} barWidth={17}/>
						</D3Chart>
					</div>
				</MediaQuery>

				<MediaQuery query="(min-width: 623px) and (max-width: 1023px)">
					<div>
						<D3Chart aspectRatio={3} svgClassName={`demographic-bars`}>
							<DemographicBar category="gender" trackerData={this.parseData("gender")} barWidth={15}/>
							<DemographicBar category="age" trackerData={this.parseData("age")} barWidth={15}/>
							<DemographicBar category="income" trackerData={this.parseData("income")} barWidth={15}/>
						</D3Chart>
						<D3Chart aspectRatio={3} svgClassName={`demographic-bars`}>
							<DemographicBar category="education" trackerData={this.parseData("education")} barWidth={15}/>
							<DemographicBar category="kids" trackerData={this.parseData("kids")} barWidth={15}/>
							<DemographicBar category="race_US" trackerData={this.parseData("race_US")} barWidth={15}/>
						</D3Chart>
					</div>
				</MediaQuery>

				<MediaQuery query="(max-width: 622px)">
					<div>
						<D3Chart aspectRatio={2} svgClassName={`demographic-bars`}>
							<DemographicBar category="gender" trackerData={this.parseData("gender")} barWidth={13}/>
							<DemographicBar category="age" trackerData={this.parseData("age")} barWidth={13}/>
						</D3Chart>
						<D3Chart aspectRatio={2} svgClassName={`demographic-bars`}>
							<DemographicBar category="income" trackerData={this.parseData("income")} barWidth={13}/>
							<DemographicBar category="education" trackerData={this.parseData("education")} barWidth={13}/>
						</D3Chart>
						<D3Chart aspectRatio={2} svgClassName={`demographic-bars`}>
							<DemographicBar category="kids" trackerData={this.parseData("kids")} barWidth={13}/>
							<DemographicBar category="race_US" trackerData={this.parseData("race_US")} barWidth={13}/>
						</D3Chart>
					</div>
				</MediaQuery>
            </div>
        )
    }

};


DemographicCharts.propTypes = {
    trackerData: PropTypes.object.isRequired,
   // category : PropTypes.string.isRequired,
    title    : PropTypes.string
};

export default DemographicCharts;
