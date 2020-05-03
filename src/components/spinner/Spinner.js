import React from "react";
import "./Spinner.css";

export const Spinner = ({ color = "#ffffff", size = 15, type = "default" }) => {
  return (
    <div
      style={{
        borderRightColor: color,
        width: `${size}px`,
        height: `${size}px`
      }}
      className={`lds-dual-ring ${type}`}
    />
  );
};
