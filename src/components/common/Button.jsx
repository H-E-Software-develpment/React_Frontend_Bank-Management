const Button = ({ children, className = "", type = "button", ...props }) => (
  <button 
    type={type}
    className={className} 
    {...props}
  >
    {children}
  </button>
);

export default Button;