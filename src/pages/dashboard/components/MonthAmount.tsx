import React, {Component} from "react";

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import {Card} from "antd";

interface MonthAmountProps {
  data: LastAmountType[];
}


class MonthAmount extends Component<MonthAmountProps> {
  render() {
    const {data} = this.props;
    const cols = {
      date: {
        alias: "月份"
      },
      amount: {
        tickInterval: 20000,
        alias: "金额"
      }
    };

    return (
      <Card title={"近一年月消费情况"}>
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis name="date"/>
          <Axis name="amount"/>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            shape="smooth"
            position="date*amount"
            color={['amount', '#E6F6C8-#3376CB']}/>
        </Chart>
      </Card>
    );
  }
}

export default MonthAmount;
