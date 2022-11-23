import React from "react";

const Button = ({ name, onClick }) => {
  return (
    <button
      className="btn-grad"
    
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default Button;
