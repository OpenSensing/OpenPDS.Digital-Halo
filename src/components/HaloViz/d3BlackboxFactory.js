/**
 * Created by mpio on 27/02/2017.
 * Taken from on React-d3-HOC-Axis CodePen by SWIZEC TELLER https://codepen.io/swizec/pen/woNjVw
 */
import React, {Component} from 'react';


const d3BlackboxFactory = (d3Render)=>{
    return class D3Blackbox extends Component {
		static defaultProps = {
			x: "2",
            y: "2"
		};

        componentDidMount() {d3Render.call(this)}
        componentDidUpdate() {d3Render.call(this)}

        render() {
            /* TODO:commented lines with 'width' where in head, verify validity
            const {x, y, width} = this.props;
            return <g transform={`translate(${x}, ${y})`} width={`${width}`} ref="anchor" />
            */
            const {x, y} = this.props;
            return <g transform={`translate(${x}, ${y})`} ref="anchor" />
        }
    }
};


export default d3BlackboxFactory;