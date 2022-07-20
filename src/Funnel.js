import React from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Alert, Spinner } from "react-bootstrap";
import cumulateValues from "./cumulate";
import addPercentagesToLabels from "./addPercentageToLabels";
import addMultiplierToLabels from "./addMultiplierToLabels";

const filterData = (data = {}, groupIds = []) =>
  (data?.data?.boards || [])
    .flatMap(({ groups }) => groups)
    .filter(({ id }) => (groupIds.length ? groupIds.includes(id) : true))
    .map(({ title, items }) => ({
      name: title,
      value: items.length,
    }));

const transformRatio = (data = [], ratio = "") => {
  switch (ratio) {
    case "percentage":
      return addPercentagesToLabels(data);
    case "numeric":
      return addMultiplierToLabels(data);
    default:
      return data;
  }
};

const Funnel = ({ data, filters, ratio, cumulate }) => {
  if (!data?.data) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" size="sm" />
        <span className="mx-1">Loading...</span>
      </div>
    );
  }

  try {
    const filteredData = filterData(data, filters);
    const transformedData = transformRatio(
      cumulate ? cumulateValues(filteredData) : filteredData,
      ratio
    );

    return !transformedData.length ? (
      <Alert variant="danger">No data available</Alert>
    ) : (
      <FunnelChart data={transformedData} pallette={["#3b7dd8", "#64a1f4"]} />
    );
  } catch (error) {
    return (
      <div>
        <Alert variant="danger">{error.message}</Alert>
        <strong>data:</strong>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <strong>filters:</strong>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
      </div>
    );
  }
};

export default Funnel;
