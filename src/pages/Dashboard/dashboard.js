import React, { useContext, useEffect, useState } from "react";
import { store } from "../../stateManagement/store";
import { Spinner } from "../../components/spinner/Spinner";
import TenantDashboard from "../tenantDashboard/TenantDashboard";
import AgentDashboard from "../agentDashboard/AgentDashboard";
import AgencyDashboard from "../agencyDashboard/AgencyDashboard";

import "./dashboard.css";
import { setPageTitleAction } from "../../stateManagement/actions";

function Dashboard(_) {
  const { dispatch } = useContext(store);
  const [profileLoader, setProfileLoader] = useState(true);

  const {
    state: { userDetails }
  } = useContext(store);

  useEffect(() => {
    dispatch({ title: setPageTitleAction, payload: "Dashboard" });
  });

  const getProfileStats = () => {
    if (userDetails.user) {
      setProfileLoader(false);
    }
  };

  const role = profileLoader ? "" : userDetails.role.name;

  const whatToShow = () => {
    if (role == "tenant") {
      return <TenantDashboard />;
    }
    if (role == "agent" || role == "landlord") {
      return <AgentDashboard />;
    }
    if (role == "agency") {
      return <AgencyDashboard />;
    }
  };

  useEffect(() => {
    getProfileStats();
  }, [userDetails]);

  return <>{profileLoader ? <Spinner /> : whatToShow()}</>;
}

export const ViewCard = ({ title, children }) => {
  return (
    <div className="views-card">
      <h4>{title}</h4>
      <div className="content">{children}</div>
      <div className="bottom">
        <h5>Show More</h5>
      </div>
    </div>
  );
};

export default Dashboard;
