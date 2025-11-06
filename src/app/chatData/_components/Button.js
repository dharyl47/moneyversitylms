import PropTypes from 'prop-types';

const Button = ({ onClick, text = 'Click Me', type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#4CAF50] text-[#FAFBF7] py-2 px-4 rounded-md hover:bg-[#45A049] focus:outline-none focus:ring-2 focus:ring-[#45A049] ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
