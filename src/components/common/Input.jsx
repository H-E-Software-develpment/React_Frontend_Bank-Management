const Input = ({
  label,
  type = "text",
  className = "",
  isPassword = false,
  hasUserIcon = false,
  ...props
}) => {
  if (isPassword) {
    return <input type={type} className={className} {...props} />;
  }

  if (hasUserIcon) {
    return (
      <div className="input-container">
        {label && <label className="input-label">{label}</label>}
        <div className="input-with-icon">
          <input type={type} className={className} {...props} />
          <div className="input-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input type={type} className={className} {...props} />
    </div>
  );
};

export default Input;
