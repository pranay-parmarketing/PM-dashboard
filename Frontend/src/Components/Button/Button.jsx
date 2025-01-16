import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Import the CSS file for default styles

const Button = ({ children, onClick, style, className }) => {
  return (
    <button
      className={`custom-button ${className || ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

// Define prop types for the Button component
Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Button;
