/**
 * Created by mpio on 26/10/16.
 */
import React, {Component} from 'react';
import CookieSection from './CookieSection';
import DemographySection from './DemographySection';
import SummarySection from './SummarySection';
import MediaQuery from 'react-responsive';

import { Container } from 'semantic-ui-react';

const bigStyle = {display:"inline-block", width: "50%"};

class HaloViz extends Component {
    constructor(props) {
        super(props);
        this.state = {activeTracker: 'full'}
    };


    render() {
        let cookieSectionTitle = `Who is watching you?\n(${this.state.activeTracker})`;
        let demographicSectionTitle = `Who does ${this.state.activeTracker} think you are?`;
        return (
             <Container as="main" style={{ marginTop: '2em', minWidth: '420px'}} >
                 <MediaQuery query="(min-width: 1025px)">
                    <section  style={Object.assign({},bigStyle, {float:"left"})}>
                        <CookieSection title={cookieSectionTitle}
                                   onClick={(tracker)=>{this.setState({activeTracker: tracker.name});console.log('cookie click cb: '+tracker.name)}}/>
                    </section>
                 </MediaQuery>
                 <MediaQuery query="(min-width: 1025px)">
                     <section style={bigStyle}>
                        <DemographySection title={demographicSectionTitle}
                                           activeTracker={this.state.activeTracker}/>
                     </section>
                 </MediaQuery>
                 <MediaQuery query="(max-width: 1024px)">
                     <section>
                         <CookieSection title={cookieSectionTitle}
                                        onClick={(tracker)=>{console.log('cookie click cb: ');console.log(tracker);this.setState({activeTracker: tracker.name});}}/>
                     </section>
                 </MediaQuery>
                 <MediaQuery query="(max-width: 1024px)">
                     <section>
                         <DemographySection title={demographicSectionTitle}
                                            activeTracker={this.state.activeTracker}/>
                     </section>
                 </MediaQuery>

                 {<SummarySection
                                    title="Simply Put"
                                    who={this.state.activeTracker}
                                    viz={{src:'missing', alt:'Summary Section'}} />}
            </Container>
        )
    }
}




export default HaloViz