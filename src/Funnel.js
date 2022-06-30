import React from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";

const Funnel = ({ data }) => (
  <FunnelChart
    data={data}
    style={{ width: "100%", height: "100%" }}
    pallette={["#3b7dd8", "#64a1f4"]}
  />
);

export default Funnel;
