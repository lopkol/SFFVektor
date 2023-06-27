'use strict';

const React = require('react');
//const PropTypes = require('prop-types');

const defaultStyles = { display: 'inline-block', verticalAlign: 'middle' };

const SffVektorIcon = ({ size, color, className, style, viewBox }) => {
  const styles = { ...defaultStyles, ...style };
  return (
    <svg
      className={className}
      style={styles}
      viewBox={viewBox}
      width={`${size}px`}
      height={`${size}px`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g fill={color}>
        <polygon
          className="st0"
          points="1.33,125.83 202.33,125.83 183.33,160.83 64.33,160.83 129.33,287.83 267.33,17.83 312.33,17.83
				130.33,381.83"
        />
        <polygon
          className="st0"
          points="270.33,124.83 251.33,161.83 315.33,161.83 315.33,184.83 399.33,143.83 314.33,97.83
				314.33,124.83"
        />
      </g>
    </svg>
  );
};

SffVektorIcon.defaultProps = {
  size: 20,
  color: '#000000',
  viewBox: '0 0 400 400',
  style: {},
  className: ''
};

/*SffVektorIcon.propTypes = {
  size: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  style: PropTypes.shape(PropTypes.object),
  className: PropTypes.string,
};*/

module.exports = SffVektorIcon;
