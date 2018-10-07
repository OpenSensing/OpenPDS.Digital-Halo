/**
 * Created by mpio on 25/10/16.
 */
import React, {Component, Children, PropTypes} from 'react';
//import throttle from 'lodash/throttle';


class D3Chart extends Component {
    state = {
        width : 400
    };

    updateDimentions() {
        if (!this.refs.chartContainer) return

        const {offsetWidth} = this.refs.chartContainer;
        const padding                = 10;

        this.setState({
            width: offsetWidth - 2*padding
        })

    };

    componentWillMount() {
        window.addEventListener('resize', this.updateDimentions.bind(this))
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimentions)
    }
    componentDidMount() {
        this.updateDimentions()
    }

    render() {
        const {width} = this.state
            , {aspectRatio, svgClassName} = this.props
            , height  = width / aspectRatio
            , childrenCount = this.props.children.length || 1;




        const children = Children.map(this.props.children, (child, i)=>{
            return React.cloneElement(
                child,
                {width: width / childrenCount,
                 height: height,
                 x: 2 + i*(width / childrenCount)}
            )
        });
        return (
            <div className="chartContainer" ref="chartContainer">
                <svg width={width} height={height} className={svgClassName}>

                    {children}
                </svg>
            </div>)
    }
}


D3Chart.propTypes = {
    //TODO: children are only svg subelements
    aspectRatio: PropTypes.number
};

D3Chart.defaultProps = {
    aspectRatio: 4
};

export default D3Chart;