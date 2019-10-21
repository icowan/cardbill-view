import {Alert, Button, Card, Form, Icon, Input, InputNumber, Select, List, Tag, Typography, Avatar} from 'antd';
import React, {Component} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {connect} from 'dva';
import {CreditCardType, ListState} from '@/pages/creditcard/list/data';
import styles from "../list/style.less";

interface ListProps extends FormComponentProps {
  dispatch: Dispatch<Action<'creditcard/fetch' | 'creditcardList/add' | 'bank/fetch'>>;
  loading: boolean;
}

@connect(
  ({
     loading,
   }: {
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    loading: loading.effects['creditcard/fetch'],
  }),
)
class Index extends Component<ListProps> {
  state: ListState = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {passive: true});
    const {dispatch} = this.props;
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

    console.log(this.props)

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          >>>>>>>>>>消费记录及图表
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"/>{' '}
            使用简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"/>{' '}
            使用文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>

      </div>
    );

    return (
      <div>
        <PageHeaderWrapper content={content} extra={extraContent}>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create<ListProps>()(Index);
