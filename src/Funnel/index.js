import React from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Alert, Spinner } from "react-bootstrap";
import cumulateValues from "./cumulate";
import addPercentagesToLabels from "./addPercentageToLabels";
import addMultiplierToLabels from "./addMultiplierToLabels";

const RATIO_TRANSFORMATIONS = {
  percentage: addPercentagesToLabels,
  numeric: addMultiplierToLabels,
};

const groups = (data = {}, groupIds = []) =>
  (data?.data?.boards || [])
    .flatMap(({ groups }) => groups)
    .filter(({ id }) => (groupIds.length ? groupIds.includes(id) : true))
    .filter(({ items }) => items.length);

const filterData = (data = {}, groupIds = []) =>
  groups(data, groupIds).map(({ title, items }) => ({
    name: title,
    value: items.length,
  }));

const colors = (data = {}, groupIds = []) =>
  groups(data, groupIds).flatMap(({ color }) => color);

const transformRatio = (data = [], ratio = "") =>
  (RATIO_TRANSFORMATIONS[ratio] || ((input) => input))(data);

const transform = (data = [], filters = [], ratio = "", cumulate = false) => {
  const filteredData = filterData(data, filters);
  return transformRatio(
    cumulate ? cumulateValues(filteredData) : filteredData,
    ratio
  );
};

const data_is_empty_alert = (data) => {
  if (!data?.data) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" size="sm" />
        <span className="mx-1">Loading...</span>
      </div>
    );
  }
};

const no_data_points_alert = (data, filters) => {
  if (!transform(data, filters).length) {
    return <Alert variant="danger">No data available</Alert>;
  }
};

const Funnel = ({ data, filters, ratio, cumulate }) => {
  try {
    return (
      data_is_empty_alert(data) ||
      no_data_points_alert(data, filters) || (
        <FunnelChart
          data={transform(data, filters, ratio, cumulate)}
          pallette={colors(data, filters)}
        />
      )
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
