/**
 * Created by mpio on 26/10/16.
 */
import React, {PropTypes} from 'react';
import CookiesChart from './CookieChart';
import { Header } from 'semantic-ui-react'
//const trackerData   = JSON.parse(window.localStorage.getItem('demoPerTracker'));
const trackerList   = JSON.parse(window.localStorage.getItem('trackerList'));
const trackerCounts = JSON.parse(window.localStorage.getItem('trackerCounts'));
//const companyData   = JSON.parse(window.localStorage.getItem('demoPerCompany'));
const companyList   = JSON.parse(window.localStorage.getItem('companyList'));



const CookieSection = ({title, onClick}) => (
    <section id='cookie-section'>
        <Header textAlign="center" as="h2" style={{"white-space": "pre"}}>{title}</Header>
        <CookiesChart onClick={onClick} trackerCounts={trackerCounts}
                      trackerList={trackerList} companyList={companyList} />
    </section>
);

CookieSection.proptTypes = {
    title: PropTypes.string.isRequired//,
   // viz: PropTypes.object.isRequired
};

export default CookieSection;

