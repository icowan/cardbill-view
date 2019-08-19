import { Alert, Icon, Card, Form} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import styles from './style.less';
import TableForm from './components/TableForm';


interface ListProps extends FormComponentProps {
    dispatch: Dispatch<any>;
    submitting: boolean;
    modelState: StateType;
}

const tableData = [
    {
      key: '1',
      bank_name: "招商银行",
      card_name: '经典白金卡',
      business_type: '酒楼饭馆',
      business_name: '全聚德北京',
      rate: "0.55%",
      amount: 8158,
      arrival: 8113.13,
      created_at: "2019-08-19 14:30:11"
    },
    {
        key: '2',
        card_name: '招商银行-经典白金卡',
        business_type: '酒楼饭馆',
        business_name: '全聚德北京',
        rate: "0.55%",
        amount: 8158,
        arrival: 8113.13,
        created_at: "2019-08-19 14:30:11"
    },
    {
        key: '3',
        card_name: '招商银行-经典白金卡',
        business_type: '酒楼饭馆',
        business_name: '全聚德北京',
        rate: "0.55%",
        amount: 8158,
        arrival: 8113.13,
        created_at: "2019-08-19 14:30:11"
    },
];

@connect(({ loading, modelState }: { modelState: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
    submitting: loading.effects['record/list'], 
    modelState
}))
class List extends Component<ListProps> {
    state = {
        width: '100%',
    };

    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
        const {dispatch} = this.props;
        dispatch({
            type: 'record/list',
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
            const { width: stateWidth } = this.state;
            if (stateWidth !== width) {
            this.setState({ width });
            }
        }
        });
    };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const {
        form: { getFieldDecorator },
    } = this.props;

    console.log(this.props)
    return (
      <div>
        <PageHeaderWrapper content="随时随地记录您的刷卡记录。">
          <Card title="消费记录" bordered={false}>
            {getFieldDecorator('record', {
              initialValue: tableData,
            })(<TableForm />)}
          </Card>
        </PageHeaderWrapper>
        {/* <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar> */}
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
