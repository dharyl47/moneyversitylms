import PropTypes from 'prop-types';

const Button = ({ onClick, text = 'Click Me', type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;