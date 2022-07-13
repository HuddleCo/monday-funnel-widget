import React from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Spinner } from "react-bootstrap";

const safeDivide = (numerator, denominator) =>
  denominator <= 0 ? 0 : Math.round((numerator / denominator) * 100);

const addPercentagesToLabels = (data = []) =>
  [data[0]].concat(
    data.slice(1).map((item, index) => ({
      ...item,
      name: `${item.name} (${safeDivide(item.value, data[index].value)}%)`,
    }))
  );

const transform = (data = {}, groupIds = []) =>
  addPercentagesToLabels(
    (data?.data?.boards || [])
      .flatMap(({ groups }) => groups)
      .filter(({ id }) => (groupIds.length ? groupIds.includes(id) : true))
      .map(({ title, items }) => ({
        name: title,
        value: items.length,
      }))
  );

const Funnel = ({ data, filters }) => {
  if (!data?.data) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status" size="sm" />
        <span className="mx-1">Loading...</span>
      </div>
    );
  }

  const transformedData = transform(data, filters);

  return (
    <FunnelChart data={transformedData} pallette={["#3b7dd8", "#64a1f4"]} />
  );
};

export default Funnel;
