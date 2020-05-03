import React from "react";
import "./activitySummaryCard.css";

export const ActivitySummaryCard = ({
  image,
  mainContent,
  subContent,
  color = ""
}) => {
  return (
    <div className={`activity-summary-card ${color}`}>
      <div className="img-con">
        <img src={image} alt="" />
      </div>
      <div className="content-segment">
        <h4>{mainContent.title}</h4>
        <p>{mainContent.count}</p>
        <div className="divider" />
        <h4>{subContent.title}</h4>
        <p>{subContent.count}</p>
      </div>
    </div>
  );
};
