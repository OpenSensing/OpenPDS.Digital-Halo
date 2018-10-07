//import React, { Component } from 'react';
/* global chrome */
import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HaloViz from './components/HaloViz/HaloViz';


const App = () => (
    <div className="app">
    
        {/*<Header />*/}

        <HaloViz />
        
        <Footer aboutLinks={[
            {href:'#', target:'Project Home', url:'http://digitalhalo.org/'},
			{href:'#', target:'Sponsor', url: 'https://datatransparencylab.org/dtl-2015/grantees-2015/'}
		]}/>

    </div>
);

export default App;
