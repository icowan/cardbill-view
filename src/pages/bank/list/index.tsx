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
    submitting: loading.effects['record/creditCards'],
  }),
)
class List extends Component<ListProps> {
  state = {
    width: '100%',
    pagination: {},
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'record/creditCards',
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
  };

  onAddCard = (record: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'record/addCreditCard',
      payload: record,
    });
  };

  render() {
    const {
      record: { banks, creditCards },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <PageHeaderWrapper content="随时随地记录您的刷卡记录。">
          <Card title="刷卡记录" bordered={false}>
            {getFieldDecorator('record', {
              initialValue: creditCards,
            })(
              <TableForm
                onChange={this.onAddCard}
                onLoadBanks={this.onLoadBanks}
                banks={banks}
                creditCards={creditCards}
                pagination={this.state.pagination}
              />,
            )}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
