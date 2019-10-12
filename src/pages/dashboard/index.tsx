import {connect} from "dva";
import React, {Component} from "react";
import {FormComponentProps} from "antd/es/form";
import {Action, Dispatch} from "redux";
import LastAmount from "@/pages/dashboard/components/LastAmount";

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
    const {lastAmount} = dashboard;
    return (
      <div>
        <LastAmount data={lastAmount}/>
      </div>
    );
  }
}

export default Dashboard;
