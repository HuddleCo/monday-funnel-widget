import React from "react";
import { FunnelChart } from "react-funnel-pipeline";
import "react-funnel-pipeline/dist/index.css";
import { Spinner } from "react-bootstrap";

const addPercentagesToLabels = (data = []) =>
  [data[0]].concat(
    data.slice(1).map((item, index) => ({
      ...item,
      name: `${item.name} (${
        data[index].value <= 0
          ? 0
          : Math.round((item.value / data[index].value) * 100)
      }%)`,
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
        Loading...
      </div>
    );
  }

  const transformedData = transform(data, filters);

  return (
    <FunnelChart data={transformedData} pallette={["#3b7dd8", "#64a1f4"]} />
  );
};

export default Funnel;
