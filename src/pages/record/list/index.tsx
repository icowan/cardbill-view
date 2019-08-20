import { Alert, Icon, Card, Form } from 'antd';
// import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
// import styles from './style.less';
import TableForm from './components/TableForm';

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  record: StateType;
}

@connect(
  ({
    record,
    loading,
  }: {
    record: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    record,
    submitting: loading.effects['record/list'],
  }),
)
class List extends Component<ListProps> {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    const { dispatch } = this.props;
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

  onLoadBanks = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/banks',
    });
    dispatch({
      type: 'record/businesses',
    });
  };

  onLoadCreditCards = (bankId: number) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/creditCards',
      payload: {
        bank_id: bankId,
      },
    });
  };

  onAddRecord = (record: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/addRecord',
      payload: record,
    });
  };

  render() {
    const {
      record: { list, banks, creditCards, businesses },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <PageHeaderWrapper content="随时随地记录您的刷卡记录。">
          <Card title="刷卡记录" bordered={false}>
            {getFieldDecorator('record', {
              initialValue: list,
            })(
              <TableForm
                onChange={this.onAddRecord}
                onLoadBanks={this.onLoadBanks}
                businesses={businesses}
                banks={banks}
                creditCards={creditCards}
                onLoadCreditCards={this.onLoadCreditCards}
              />,
            )}
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
