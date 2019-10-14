import React, {Component} from "react";

import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";
import {Card} from "antd";

interface LastAmountProps {
  data: LastAmountType[];
}


class LastAmount extends Component<LastAmountProps> {
  render() {
    const {data} = this.props;
    const cols = {
      date: {
        alias: "日期"
      },
      amount: {
        alias: "金额"
      }
    };
    return (
      <Card title={"近30天消费情况"} style={{marginBottom: 20}}>
        <Chart height={400} data={data} scale={cols} forceFit>
          <Axis
            name="date"
            title={null}
            tickLine={null}
            line={{
              stroke: "#E6E6E6"
            }}
          />
          <Axis
            name="amount"
            line={false}
            tickLine={null}
            grid={null}
            title={null}
          />
          <Tooltip/>
          <Geom
            type="line"
            position="date*amount"
            size={1}
            color="l (270) 0:rgba(255, 146, 255, 1) .5:rgba(100, 268, 255, 1) 1:rgba(215, 0, 255, 1)"
            shape="smooth"
            style={{
              shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
              shadowBlur: 60,
              shadowOffsetY: 6
            }}
          />
        </Chart>
      </Card>
    );
  }
}

export default LastAmount;
