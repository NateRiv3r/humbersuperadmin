import React from "react";
import "./Card.css";

export const Card = ({ className, style = {}, heading, children }) => {
  return (
    <div className={`card-main ${className}`} style={style}>
      {heading && <div className="card-heading">{heading}</div>}
      <div className="card-content">{children}</div>
    </div>
  );
};
