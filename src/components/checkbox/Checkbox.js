import React, { Fragment } from "react";

import "./Checkbox.css";

export const Checkbox = ({
  checked,
  id,
  label = "",
  name = "",
  onChange,
  className,
  disabled
}) => {
  const properties = {
    className: "Checkbox " + className,
    type: "checkbox"
  };

  return (
    <Fragment>
      <input
        checked={checked}
        id={id}
        name={name}
        onChange={onChange}
        disabled={disabled}
        {...properties}
      />
      <label htmlFor={id}>{label}</label>
    </Fragment>
  );
};
