import React from "react";
import "./Toggle.css";

export function Toggle({ toggleStatus, handleToggle, className }) {
  return (
    <div className={`Toggle ${className}`}>
      <div
        onClick={() => handleToggle(!toggleStatus)}
        className={"toggle-wrapper " + (toggleStatus ? "active" : "")}
      >
        <div className={"toggle-switch " + (toggleStatus ? "active" : "")} />
      </div>
    </div>
  );
}
