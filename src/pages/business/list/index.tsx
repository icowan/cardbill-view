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
  business: StateType;
}

@connect(
  ({
    business,
    loading,
  }: {
    business: StateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    business,
    submitting: loading.effects['business/list'],
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
      type: 'business/list',
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

  onAddBusiness = (record: any) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'business/addBusiness',
      payload: record,
    });
  };

  render() {
    const {
      business: { list },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <PageHeaderWrapper content="随时随地查看商户信息。">
          <Card title="商户" bordered={false}>
            {getFieldDecorator('business', {
              initialValue: list,
            })(<TableForm onChange={this.onAddBusiness} />)}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
