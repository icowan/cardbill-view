import {Button, Card, Form, Icon, List, Tag, Typography, Avatar, Timeline} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {CreditCardType, ListState} from '@/pages/creditcard/list/data';
import {BankType} from '@/pages/bank/list/data';
import CreateForm from '@/pages/creditcard/list/components/CreateForm';
import {BankStateType} from '@/models/bank';
import {CreditCardStateType} from '@/pages/creditcard/list/model';
import styles from "./style.less";
import {Link} from "umi";
import {BillStateType} from "@/models/bill";
import {StandardTableProps} from "@/pages/creditcard/list/components/StandardTable";
import moment from "moment";

const {Paragraph} = Typography;

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcard/fetch' | 'creditcardList/add' | 'bank/fetch' | 'bill/fetchRecentRepay'>>;
  loading: boolean;
  creditcard: CreditCardStateType;
}

const BankColor = {
  '1': 'magenta',
  '2': 'red',
  '3': 'volcano',
  '4': 'orange',
  '5': 'gold',
  '6': 'lime',
  '7': 'green',
  '8': 'cyan',
  '9': 'blue',
  '10': 'geekblue',
  '11': 'purple',
  '12': '#f50',
  '13': '#2db7f5',
  '14': '#10239e',
  '15': '#391085',
  '16': '#9e1068',
  '17': '#391085',
  '18': '#eb2f96',
  '19': '#520339',
  '20': '#120338',
};

@connect(
  ({
     creditcard,
     bank,
     bill,
     loading,
   }: {
    creditcard: CreditCardStateType;
    bank: BankStateType;
    bill: BillStateType;
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    creditcard,
    bank,
    bill,
    loading: loading.effects['creditcard/fetch'],
  }),
)
class Index extends Component<ListProps, ListState> {
  state: ListState = {
    modalVisible: false,
    updateModalVisible: false,
    width: '100%',
  };

  columns: StandardTableProps[] = [
    {
      title: '银行',
      dataIndex: 'bank',
      key: 'bank',
      render: (text: BankType) => {
        return <Tag color={BankColor[text.id]}>{text.bank_name}</Tag>;
      },
    },
    {
      title: '信用卡',
      dataIndex: 'card_name',
      key: 'card_name',
    },
    {
      title: '固定额度',
      dataIndex: 'fixed_amount',
      key: 'fixed_amount',
    },
    {
      title: '临时额度',
      dataIndex: 'max_amount',
      key: 'max_amount',
    },
    {
      title: '账单日',
      dataIndex: 'billing_day',
      key: 'billing_day',
      render: (text: number) => {
        return '每月 ' + text + ' 日';
      },
    },
    {
      title: '还款日',
      dataIndex: 'cardholder',
      key: 'cardholder',
      width: 120,
      render: (text: number) => {
        return '每月 ' + text + ' 日';
      },
    },
    {
      title: '上期账单',
      dataIndex: 'billing_amount',
      key: 'billing_amount',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '下期账单',
      dataIndex: 'next_billing_amount',
      key: 'next_billing_amount',
      render: (text: number) => {
        return '¥' + text;
      },
    },
    {
      title: '余额',
      dataIndex: 'billing_amount',
      key: 'balance',
      render: (text: number, record: CreditCardType) => {
        return '¥' + (record.max_amount - text);
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      width: 160,
      render: (text: number) => {
        return text == 0 ? '正常' : '其他';
      },
    },
    {
      title: '操作',
      key: 'action',
    },
  ];

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
    dispatch({
      type: 'creditcard/fetch',
    });

    dispatch({
      type: 'bill/fetchRecentRepay',
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

  handleAdd = (params: CreditCardType) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'creditcardList/add',
      payload: params,
      callback: () => {
        dispatch({type: 'creditcard/fetch'});
      },
    });

    this.handleModalVisible();
  };

  handleModalVisible = (flag?: boolean) => {
    if (flag) {
      const {dispatch} = this.props;
      dispatch({
        type: 'bank/fetch',
      });
    }

    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const {
      creditcard: {data},
      bank,
      loading,
      bill
    } = this.props;

    const billData = bill.data;

    const {modalVisible} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      banks: bank.data,
    };

    const content = (
      billData && <div className={styles.pageHeaderContent}>
        <h4>近期账单</h4>
        <Timeline>
          {billData.map((item, key) => {
            return <Timeline.Item key={key} dot={<Icon type="clock-circle-o" style={{fontSize: '16px'}}/>} color="red">
              <Link
                to={`/credit-card/${item.credit_card.id}`}>{item.credit_card.bank.bank_name}-{item.credit_card.card_name}</Link> 还款日: <Tag
              color="orange">{moment(new Date(item.repayment_day)).format('YYYY/MM/DD')}</Tag> 金额: <Tag
              color="gold">{item.amount}</Tag>
            </Timeline.Item>
          })}
        </Timeline>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>

      </div>
    );

    const nullData: Partial<CreditCardType> = {};

    return (
      <PageHeaderWrapper content={content} extra={extraContent}>
        {/*<Card*/}
        {/*  title="信用卡列表"*/}
        {/*  bordered={false}*/}
        {/*  extra={*/}
        {/*    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>*/}
        {/*      增加信用卡*/}
        {/*    </Button>*/}
        {/*  }*/}
        {/*>*/}
        {/*  <StandardTable loading={loading} data={{ list: data }} columns={this.columns} />*/}
        {/*</Card>*/}

        <List<Partial<CreditCardType>>
          rowKey="id"
          loading={loading}
          grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
          dataSource={[nullData, ...data]}
          renderItem={item => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[<Link to={`/credit-card/${item.id}`} key="option1">详情</Link>]}
                  >
                    <Card.Meta
                      avatar={<Avatar className={styles.cardAvatar}
                                      style={{backgroundColor: BankColor[item.bank.id]}}>{item.bank.bank_name.slice(0, 1)}</Avatar>}
                      title={<Link to={`/credit-card/${item.id}`}>{item.bank.bank_name} - {item.card_name}</Link>}
                      description={
                        <Paragraph className={styles.item} ellipsis={{rows: 3}}>
                          <div>卡号后四位: <Tag color={BankColor[item.bank.id]}>{item.tail_number}</Tag></div>
                          <div>固定额度: <b>{item.fixed_amount}</b></div>
                          <div>临时额度: {item.max_amount}</div>
                          <div>账单日: 每月 {item.billing_day} 日</div>
                          <div>还款日: 每月 {item.cardholder} 日</div>
                        </Paragraph>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button type="dashed" onClick={() => this.handleModalVisible(true)} className={styles.newButton}>
                  <Icon type="plus"/> 增加信用卡
                </Button>
              </List.Item>
            );
          }}
        />

        <CreateForm {...parentMethods} modalVisible={modalVisible}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ListProps>()(Index);
