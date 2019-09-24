import { Button, Card, Form } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { BusinessStateType } from '@/models/business';
import { CreditCardType } from '@/types/creditcard';
import StandardTable, {
  StandardTableColumnProps,
} from '@/pages/business/list/components/StandardTable';
import { ListState } from '@/pages/business/list/data';
import CreateForm from '@/pages/business/list/components/CreateForm';

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  submitting: boolean;
  business: BusinessStateType;
}

@connect(
  ({
    business,
    loading,
  }: {
    business: BusinessStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    business,
    loading: loading.effects['business/fetch'],
  }),
)
class List extends Component<ListProps, ListState> {
  state: ListState = {
    width: '100%',
    modalVisible: false,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: 'MCC',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '名称',
      dataIndex: 'business_name',
      key: 'business_name',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'business/fetch',
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

  handleAdd = (params: CreditCardType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessList/add',
      payload: params,
      callback: () => {
        dispatch({ type: 'business/fetch' });
      },
    });

    this.handleModalVisible();
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const {
      business: { data },
      loading,
    } = this.props;

    const { modalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <PageHeaderWrapper content="随时随地查看商户信息。">
          <Card
            title="商户"
            bordered={false}
            extra={
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加商户类型
              </Button>
            }
          >
            <StandardTable loading={loading} data={{ list: data }} columns={this.columns} />
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(List);
