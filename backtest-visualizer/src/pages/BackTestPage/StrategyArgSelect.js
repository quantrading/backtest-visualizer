import React from "react";
import { Select } from "antd";

const Option = Select.Option;

class StrategyArgSelect extends React.Component {
  render() {
    return (
      <Select
        defaultValue={this.props.preValue}
        style={{ width: 60 }}
        onChange={this.handleChange}
      >
        <Option value="none">None</Option>
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
        <Option value="4">4</Option>
        <Option value="5">5</Option>
        <Option value="6">6</Option>
        <Option value="10">10</Option>
        <Option value="20">20</Option>
        <Option value="30">30</Option>
        <Option value="40">40</Option>
        <Option value="50">50</Option>
        <Option value="60">60</Option>
      </Select>
    );
  }

  handleChange = value => {
    this.props.handleChange(value);
  };
}

export default StrategyArgSelect;
