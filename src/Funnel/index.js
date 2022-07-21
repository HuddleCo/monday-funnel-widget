import { FunnelChart } from "react-funnel-pipeline";
import { Flex, Heading, Loader, AttentionBox } from "monday-ui-react-core";

import "react-funnel-pipeline/dist/index.css";

import "./index.css";

import { groups, filterData, colors } from "./data";
import { calculatePercentage, calculateRatio } from "./calculate";

const data_is_empty_alert = (data) => {
  if (!data?.data) {
    return (
      <Flex
        justify={Flex.justify.CENTER}
        style={{
          width: "100%",
        }}
      >
        <Heading type={Heading.types.h1} value="Loading" />
        <Loader size={Loader.sizes.MEDIUM} />
      </Flex>
    );
  }
};

const no_data_points_alert = (data, filters) => {
  if (!groups(data, filters).length) {
    return (
      <Flex
        justify={Flex.justify.CENTER}
        style={{
          width: "100%",
        }}
      >
        <AttentionBox
          title="No data found"
          text="Attempting to process the data came up empty. Please check your board and settings."
          type={AttentionBox.types.DANGER}
        />
      </Flex>
    );
  }
};

const Funnel = ({ data, filters, count, ratio, percentage }) => {
  try {
    return (
      data_is_empty_alert(data) ||
      no_data_points_alert(data, filters) || (
        <FunnelChart
          data={filterData(data, filters)}
          pallette={colors(data, filters)}
          decorateValue={(item, index, array) =>
            !(count || percentage || ratio) ? (
              ""
            ) : (
              <ul className="calculations">
                {count && <li>{item.value}</li>}
                {percentage && (
                  <li>{calculatePercentage(item, index, array)}</li>
                )}
                {ratio && <li>{calculateRatio(item, index, array)}</li>}
              </ul>
            )
          }
        />
      )
    );
  } catch (error) {
    return (
      <div>
        <Flex
          justify={Flex.justify.CENTER}
          style={{
            width: "100%",
          }}
        >
          <AttentionBox
            title="Something went wrong"
            text={error.message}
            type={AttentionBox.types.DANGER}
          />
        </Flex>
        <strong>data:</strong>
        <pre>{JSON.stringify(data, null, 2)}</pre>
        <strong>filters:</strong>
        <pre>{JSON.stringify(filters, null, 2)}</pre>
        <strong>count:</strong>
        <pre>{JSON.stringify(count, null, 2)}</pre>
        <strong>percentage:</strong>
        <pre>{JSON.stringify(percentage, null, 2)}</pre>
        <strong>ratio:</strong>
        <pre>{JSON.stringify(ratio, null, 2)}</pre>
      </div>
    );
  }
};

export default Funnel;
