import {
  Alert,
  Button,
  Card,
  Form,
  Icon,
  Input,
  InputNumber,
  Select,
  List,
  Tag,
  Typography,
  Avatar,
  Statistic, Descriptions, Dropdown, Steps, Tooltip, Divider, Empty
} from 'antd';
import React, {Component, Fragment} from 'react';
import {GridContent, PageHeaderWrapper, RouteContext} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {CreditCardType} from '@/pages/creditcard/list/data';
import styles from "./style.less";
import {DetailState} from "@/pages/creditcard/detail/data";
import StandardTable from "@/pages/creditcard/detail/bill";
import {BankType} from "@/pages/bank/list/data";

const ButtonGroup = Button.Group;

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcarddetail'>>;
  loading: boolean;
  data: CreditCardType;
  bill?: any;
}

@connect(
  ({
     creditcarddetail,
     loading,
   }: {
    data: creditcarddetail.data,
    bill: creditcarddetail.bill,
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    data: creditcarddetail.data,
    bill: creditcarddetail.bill,
    loading: loading.effects['creditcarddetail/fetch' | 'creditcarddetail/fetchBill'],
  }),
)
class Index extends Component<ListProps> {
  state: DetailState = {
    width: '100%',
    tabActiveKey: "bill"
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch, match: {params}} = this.props;

    dispatch({
      type: 'creditcarddetail/fetch',
      payload: params,
    });

    dispatch({
      type: 'creditcarddetail/fetchBill',
      payload: params,
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

  columns = [
    {
      title: '账单时间',
      dataIndex: 'created_at',
      key: 'created_at'
    },
    {
      title: '账单金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '还款日',
      dataIndex: 'repayment_day',
      key: 'repayment_day',
      render: (text: string) => {
        return <Tag>{text}</Tag>;
      },
    },
    {
      title: '是否还款',
      dataIndex: 'fixed_amount',
      key: 'fixed_amount',
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  render() {
    const {data, bill} = this.props;
    const {tabActiveKey} = this.state;

    if (!data || !data.user) {
      return ('')
    }

    console.log(bill)

    const description = (
      <RouteContext.Consumer>
        {({isMobile}) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
            <Descriptions.Item label="创建人">{data.user.username}</Descriptions.Item>
            <Descriptions.Item label="所属银行">{data.bank.bank_name}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{data.created_at}</Descriptions.Item>
            <Descriptions.Item label="卡号末四位">{data.tail_number}</Descriptions.Item>
            <Descriptions.Item label="账单日">每月 {data.billing_day} 日</Descriptions.Item>
            <Descriptions.Item label="还款日">每月 {data.cardholder} 日</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );

    const extraContent = (
      <div className={styles.moreInfo}>
        <Statistic title="剩余额度" value={568.08} prefix="¥"/>
      </div>
    );

    const action = (
      <RouteContext.Consumer>
        {({isMobile}) => (<Fragment>
          <Button type="primary">编辑</Button>
        </Fragment>)}

      </RouteContext.Consumer>
    );


    return (
      <div>
        <PageHeaderWrapper
          title={`卡名: ${data.card_name}`}
          extra={action}
          className={styles.pageHeader}
          content={description}
          extraContent={extraContent}
          tabActiveKey={tabActiveKey}
          onTabChange={this.onTabChange}
          tabList={[
            {
              key: 'bill',
              tab: '账单历史',
            },
            {
              key: 'record',
              tab: '刷卡记录',
            },
          ]}>

          <div className={styles.main}>
            <GridContent>

              <Card title="账单列表" style={{ marginBottom: 24 }} bordered={false}>
                <StandardTable columns={this.columns} data={bill}/>
              </Card>
            </GridContent>
          </div>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(Index);
