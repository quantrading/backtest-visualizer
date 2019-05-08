import React from "react";
import PriceChart from "./PriceChart";
import WeightsInputTable from "./WeightsInputTable";
import BackTestResultTable from "./BackTestResultTable";
import { getAnnualizedReturns, getAnnualizedStd } from "utils/utils";

const BackTestPresenter = props => {
  const { data, client, columns, dataSource, func, resultList } = props;
  const { globalVariables } = data;
  const { runSimulation } = func;

  return (
    <div>
      <WeightsInputTable
        columns={columns}
        dataSource={dataSource}
        runHandler={(weightsList, name, rebalanceType) =>
          runSimulation(globalVariables, weightsList, name, rebalanceType)
        }
      />
      <PriceChart data={data} resultList={resultList} />
      <BackTestResultTable data={resultList} />
    </div>
  );
};

export default BackTestPresenter;
