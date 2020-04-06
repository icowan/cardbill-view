import React, { Component } from 'react';
import { Col, Row } from 'antd';
import styles from './index.less';
import { StatisticsType } from '@/pages/record/list/data';

export interface StatisticsProps {
  data: StatisticsType;
}

function replaceNum(num: number) {
  if (num < 999 || !num) {
    return num;
  }
  return num.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
}

class Statistics extends Component<StatisticsProps> {
  render() {
    const {
      data: {
        credit_amount,
        credit_max_amount,
        credit_number,
        total_consumption,
        monthly_consumption,
        interest_expense,
        current_interest,
        unpaid_bill,
        repaid_bill,
      },
    } = this.props;
    return (
      <div className={styles.statistics}>
        <Row type="flex" justify="space-between" gutter={16}>
          <Col span={6}>
            <div className={styles.itemBody1}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>总信用额</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div>
                  <h2 className={styles.itemNum}>¥ {replaceNum(credit_amount)}</h2>
                  <div>
                    <p className={styles.total}>¥ {replaceNum(credit_max_amount)}</p>
                    <p className={styles.desc}>临时额度</p>
                  </div>
                </div>
                <div>
                  <h2 className={styles.itemNum}>{replaceNum(credit_number)}</h2>
                  <p className={styles.desc}>张卡</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.itemBody2}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>当月刷卡金额</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div>
                <h2 className={styles.itemNum}>¥ {replaceNum(monthly_consumption)}</h2>
                <div>
                  <p className={styles.total}>¥ {replaceNum(total_consumption)}</p>
                  <p className={styles.desc}>合计刷</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.itemBody3}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>当月手续费</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div>
                <h2 className={styles.itemNum}>¥ {replaceNum(current_interest)}</h2>
                <div>
                  <p className={styles.total}>¥ {replaceNum(interest_expense)}</p>
                  <p className={styles.desc}>总手续费</p>
                </div>
              </div>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.itemBody4}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>账单</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div >
              <h2 className={styles.itemNum}>¥ {replaceNum(unpaid_bill)}</h2>
                <div>
                  <p className={styles.total}>¥ {replaceNum(repaid_bill)}</p>
                  <p className={styles.desc}>全部已还</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Statistics;
