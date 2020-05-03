import React from "react";
import "./dashboard.css";
import { Card } from "../../components/card/Card";
import { DATA, OPTIONS, DATA2, OPTIONS2 } from "./transactionGraphData";
import Graph from "../../components/graph/Graph";

function Dashboard(props) {
  return (
    <div className="dashboard">
      <div className="computes">
        <Card heading="Total GamePlays">
          <div className="contentCard">
            <div className="flex align-center justify-between">
              <div className="info">Today</div>
              <div className="context">58</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">7 days</div>
              <div className="context">1,200</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">30 days</div>
              <div className="context">14,800</div>
            </div>
          </div>
        </Card>
        <Card heading="Total Winnings">
          <div className="contentCard">
            <div className="flex align-center justify-between">
              <div className="info">Today</div>
              <div className="context">2</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">7 days</div>
              <div className="context">5</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">30 days</div>
              <div className="context">15</div>
            </div>
          </div>
        </Card>
        <Card heading="Winning Ration">
          <div className="contentCard">
            <div className="flex align-center justify-between">
              <div className="info">Today</div>
              <div className="context">0.5</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">7 days</div>
              <div className="context">0.3</div>
            </div>
            <br />
            <div className="flex align-center justify-between">
              <div className="info">30 days</div>
              <div className="context">0.25</div>
            </div>
          </div>
        </Card>
      </div>
      <br />
      <Card heading="GamePlays/Winnings vs Time">
        <div className="contentCard">
          <div className="graph-container">
            <div className="">
              <Graph
                options={OPTIONS}
                labels={DATA.labels}
                datasets={DATA.datasets}
                height={300}
                width={1000}
                className="transaction-graph"
              />
            </div>
          </div>
        </div>
      </Card>
      <br />
      <Card heading="Revenue Income/Expense vs Time">
        <div className="contentCard">
          <div className="graph-container">
            <div className="">
              <Graph
                options={OPTIONS2}
                labels={DATA2.labels}
                datasets={DATA2.datasets}
                height={300}
                width={1000}
                className="transaction-graph"
              />
            </div>
          </div>
        </div>
      </Card>
      <br />
      <br />
    </div>
  );
}

export default Dashboard;
