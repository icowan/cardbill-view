import {connect} from "dva";
import {CreditcardStateType} from "@/models/creditcard";
import {BusinessStateType} from "@/models/business";
import React, {Component} from "react";
import {FormComponentProps} from "antd/es/form";
import {Action, Dispatch} from "redux";
import {MerchantStateType} from "@/models/merchant";
import {ListState} from "@/pages/merchant/list/data";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card, Form} from "antd";


interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'merchant/fetch'>>;
  loading: boolean;
  merchant: MerchantStateType;
}

@connect(
  ({
     record,
     creditcard,
     business,
     loading,
   }: {
    record: StateType;
    creditcard: CreditcardStateType;
    business: BusinessStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    record,
    creditcard,
    business,
    loading: loading.effects['record/fetch'],
  }),
)

class List extends Component<ListProps, ListState> {
  state: ListState = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
    // todo fetch
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
    return (
      <div>
        <PageHeaderWrapper content="出现过的所有商户。">
          <Card
            title="商户"
            bordered={false}
          >
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default List
