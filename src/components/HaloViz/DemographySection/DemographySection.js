/**
 * Created by mpio on 26/10/16.
 */
import React from 'react';
import DemographicCharts from './DemographicCharts';
import { Header } from 'semantic-ui-react';
/*const trackerData = JSON.parse(window.localStorage.getItem('demoPerTracker'));
const companyData = JSON.parse(window.localStorage.getItem('demoPerCompany'));
const mergedData = Object.assign(trackerData, companyData);*/
const currentProfile = JSON.parse(window.localStorage.getItem('currentProfile'));

const DemographySection = ({title, activeTracker}) => {

    return (
        <section id="demography-section">
            <Header textAlign="center">{title}</Header>

            <DemographicCharts trackerData={currentProfile[activeTracker]} />

        </section>
    );
};



export default DemographySection;

