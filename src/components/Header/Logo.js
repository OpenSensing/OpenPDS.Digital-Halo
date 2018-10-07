/**
 * Created by mpio on 26/10/16.
 */
import React, { PropTypes } from 'react'

const Logo = ({source, alt, w, h}) => (
    <img src={source} alt={alt} className="Logo" style={{width:`${w}px`, height: `${h}px`}} />
);

Logo.propTypes = {
    source: PropTypes.string.isRequired,
	alt: PropTypes.string
};
Logo.defaultProps = {
    alt: 'Logo',
    w: 68,
    h: 45
};

export default Logo