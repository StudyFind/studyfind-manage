import React from "react";

function Form({ children, onSubmit, ...rest }) {
  const handleEnter = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleEnter} {...rest}>
      {children}
    </form>
  );
}

export default Form;
