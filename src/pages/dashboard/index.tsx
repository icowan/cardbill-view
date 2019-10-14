import {connect} from "dva";
import React, {Component} from "react";
import {FormComponentProps} from "antd/es/form";
import {Action, Dispatch} from "redux";
import LastAmount from "@/pages/dashboard/components/LastAmount";
import MonthAmount from "@/pages/dashboard/components/MonthAmount";
import {Col, Row} from "antd";

interface DashboardProps extends FormComponentProps {
  dispatch: Dispatch<Action<'dashboard/fetchLastAmount'>>;
  loading: boolean;
}

interface DashboardState {
  type: string;
  width: string;
}


@connect(
  ({
     loading,
     dashboard
   }: {
    dashboard: dashboard,
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    dashboard: dashboard,
    submitting: loading.effects['dashboard/fetchLastAmount'],
  }),
)
class Dashboard extends Component<DashboardProps, DashboardState> {
  state: DashboardState = {
    type: 'dashboard',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
    dispatch({
      type: 'dashboard/fetchLastAmount',
    });

    dispatch({
      type: 'dashboard/fetchMonthAmount',
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0] as HTMLDivElement;
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const {width: stateWidth} = this.state;
        if (stateWidth !== width) {
          this.setState({width});
        }
      }
    });
  };


  render() {
    const {dashboard} = this.props;
    const {lastAmount, monthAmount} = dashboard;
    return (
      <Row gutter={16} type="flex" justify="space-around" align="middle">
        <Col span={24}>
          <LastAmount data={lastAmount}/>
        </Col>
        <Col span={24}>
          <MonthAmount data={monthAmount}/>
        </Col>
      </Row>
    );
  }
}

export default Dashboard;
