import React, {Component} from "react";

import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";

interface LastAmountProps {
  data: LastAmountType[];
}


class LastAmount extends Component<LastAmountProps> {
  render() {
    const {data} = this.props;
    console.log(data)
    const cols = {
      date: {
        alias: "日期"
      },
      amount: {
        alias: "金额"
      }
    };
    return (
      <div>
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
            position="month*amount"
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
      </div>
    );
  }
}

export default LastAmount;
