import React, { Component } from "react";
import { Query } from "react-apollo";
import * as math from "mathjs";
import AssetAllocationChart from "components/AssetAllocationChart";
import MarketCalendar from "components/MarketCalendar";
import SelectInput from "components/SelectInput";
import ResultTable from "components/ResultTable";
import ReturnsChart from "components/ReturnsChart";
import DoughnutChart from "components/DoughnutChart";
import { GET_GLOBAL_VARIABLES } from "apollo/queries";
import { BackTest, BackTestArgsHandler, summaryTable } from "utils/simulation";
import { getRandAllocWithFixedWeights } from "utils/utils";
import { assetCodeList } from "utils/data";
import { Button } from "antd";

class AssetAllocationPage extends Component {
  render() {
    return (
      <Query query={GET_GLOBAL_VARIABLES}>
        {({ loading, error, data, client }) => {
          const { codeList, startDate, endDate } = data.globalVariables;
          const table = summaryTable(codeList, startDate, endDate);
          return (
            <div>
              <div className="asset-allocation-page">
                <SelectInput data={data} client={client} />
                <MarketCalendar data={data} client={client} />
                {table ? <ResultTable data={table} /> : null}
                <Button
                  type="primary"
                  onClick={e => this.handleOnClick(e, data)}
                >
                  Run
                </Button>
                <Button onClick={e => this.handlePlayClick(e, data)}>
                  Play
                </Button>
                <Button onClick={this.stopSimulation}>Stop</Button>
                <Button type="danger" onClick={this.handleResetClick}>
                  Reset
                </Button>
                <AssetAllocationChart
                  data={this.state.data}
                  fixedAllocation={table}
                  client={client}
                />
                <ReturnsChart data={data} />
                <DoughnutChart data={data} />
              </div>
            </div>
          );
        }}
      </Query>
    );
  }

  constructor(props) {
    super(props);
    this.simulationOnce = this.simulationOnce.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
    this.stopSimulation = this.stopSimulation.bind(this);
    this.state = {
      data: [],
      play: false
    };
    this.tempData = [];
  }

  simulationOnce(variables) {
    const { startDate, endDate, codeList } = variables;

    const tmpArray = new Array(16).fill(0);
    codeList.forEach(code => {
      const codeIndex = assetCodeList.indexOf(code);
      if (codeIndex !== -1) {
        tmpArray[codeIndex] = null;
      }
    });

    let newAllocation = getRandAllocWithFixedWeights(tmpArray);

    // EF LINE 에 영향을 미침
    newAllocation = newAllocation.map(value => math.floor(value));
    const remainWieght = 100 - math.sum(newAllocation);
    newAllocation[newAllocation.length - 1] += remainWieght;

    const backTestArgsHandler = new BackTestArgsHandler();
    backTestArgsHandler.replaceAllocation(newAllocation);
    backTestArgsHandler.setDateRange(startDate, endDate);

    const testArgs = backTestArgsHandler.getArgs();
    const backTest = new BackTest();
    backTest.init(testArgs);
    backTest.run();
    backTest.createMetaData();
    const result = backTest.result();

    const simulationResult = {
      x: math.round(result.std, 4),
      y: math.round(result.finalReturn, 4),
      labels: newAllocation,
      sharpeRatio: result.sharpeRatio
    };

    this.tempData.push(simulationResult);
    return simulationResult;
  }

  handlePlayClick(event, variables) {
    const globalVariables = variables.globalVariables;

    this.setState({ play: true });
    this.player = setInterval(() => {
      this.simulationLoopWithTimeLimit(globalVariables, 100);
      this.setState({
        data: [...this.state.data, ...this.tempData]
      });
      this.tempData = [];
    }, 1);
  }

  stopSimulation() {
    this.setState({ play: false });
    clearInterval(this.player);
  }

  simulationLoopWithTimeLimit(variables, limitTime = 1000) {
    const startTime = Date.now();
    let curTime = Date.now();
    while (true) {
      this.simulationOnce(variables);
      curTime = Date.now();
      if (curTime - startTime > limitTime) break;
    }
  }

  simulationLoopWithCountsLimit(variables, limitCounts = 1000) {
    let i = 0;
    while (true) {
      if (i === limitCounts) break;
      this.simulationOnce(variables);
      i++;
    }
  }

  handleOnClick(event, data) {
    const globalVariables = data.globalVariables;
    this.simulationLoopWithTimeLimit(globalVariables);
    this.setState({
      data: [...this.state.data, ...this.tempData]
    });
    this.tempData = [];
  }

  handleResetClick(event) {
    this.setState({
      data: []
    });
  }
}

export default AssetAllocationPage;
