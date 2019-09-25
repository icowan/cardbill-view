import React, { useState } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

const UserLanding = (props) => {
  const [userLevel] = useState(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6']);
  const [userCurrentLevel] = useState('L0');

  return (
    <Row wrap gutter={20}>
      <Col span={16}>
        <span
          className={styles.container}
          style={{
            alignItems: 'center',
            height: 70,
          }}
        >
          <div className={styles.avatarWrapper}>
            <a href="#">
              <img
                width={64}
                height={64}
                src={require('./images/avatar.jpg')}
                className={styles.avatar}
              />
            </a>
            <img
              alt="用户等级"
              src={require('./images/level.png')}
              className={styles.level}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userDetail}>
              <a href="#">
                <span className={styles.userName}>{localStorage.getItem("username")}</span>
              </a>
              <div className={styles.userLabel}>GitHub</div>
            </div>
            <div className={styles.userOther}>绑定机构：官方认证</div>
            <div className={styles.userOther}>认证信息：尊贵的玩卡用户！</div>
          </div>
          <div className={styles.userAttribute}>
            <div className={styles.userLevelWrapper}>
              <div className={styles.userLevelLine} />
              {userLevel.map((level, index) => {
                const isCurrent = userCurrentLevel === level;
                return (
                  <div
                    className={isCurrent ? styles.userlevelItemCurrent : styles.userlevelItem}
                    style={{
                      marginLeft: index === 0 ? 0 : 14,
                    }}
                    key={index}
                  >
                    {level}
                    {isCurrent && (
                      <div className={styles.userLevelLight}>当前等级</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </span>
      </Col>
    </Row>
  );
};


export default UserLanding;
