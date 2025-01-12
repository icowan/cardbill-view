import {
  Form,
  Input,
  Modal,
  Select,
  Icon,
  Divider,
  InputNumber,
  DatePicker,
  AutoComplete,
} from 'antd';

import { FormComponentProps } from 'antd/es/form';
import React from 'react';
import { BusinessType, CreateFormParams, CreditCardType } from '@/pages/record/list/data';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { MerchantType } from '@/types/merchant';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: CreateFormParams) => void;
  handleModalVisible: () => void;
  creditCards: CreditCardType[];
  businesses: BusinessType[];
  searchBusiness: () => void;
  businessItems: MerchantType[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    creditCards,
    businesses,
    searchBusiness,
    businessItems,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  let creditCardList = [];
  let businessList = [];
  for (let i in creditCards) {
    if (creditCards[i].state != 0) {
      continue;
    }
    creditCardList.push(
      <Option key={`card-${creditCards[i].id}`} value={creditCards[i].id}>
        {creditCards[i].bank.bank_name}-{creditCards[i].card_name}-{creditCards[i].tail_number}
      </Option>,
    );
  }

  for (let i in businesses) {
    businessList.push(
      <Option key={`businesses-${businesses[i].id}`} value={businesses[i].id}>
        {businesses[i].code}-{businesses[i].business_name}
      </Option>,
    );
  }

  const onChangeBusiness = (val: string, t: any) => {
    searchBusiness(val);
  };
  let dataSource = [];
  for (let i in businessItems) {
    dataSource.push(businessItems[i].merchant_name);
  }

  return (
    <Modal
      destroyOnClose
      title="增加消费记录"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="信用卡">
        {form.getFieldDecorator('card_id', {
          rules: [{ required: true, message: '请选择一张信用卡！' }],
        })(
          <Select
            style={{ width: '100%' }}
            placeholder="请选择信用卡"
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <Link to={'credit-card'}>
                  <div style={{ padding: '8px', cursor: 'pointer' }}>
                    <Icon type="plus" /> 添加信用卡
                  </div>
                </Link>
              </div>
            )}
          >
            {creditCardList}
          </Select>,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="消费金额">
        {form.getFieldDecorator('amount', {
          rules: [
            { required: true, type: 'number', message: '请输入消费金额！', min: 0.01, max: 999999 },
          ],
        })(
          <InputNumber
            style={{ width: 120 }}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="金额"
            prefix="￥"
            min={0.01}
            max={99999}
            precision={2}
            suffix="RMB"
          />,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商户类型">
        {form.getFieldDecorator('business_type', {
          rules: [{ required: true, message: '请选择商户类型！' }],
        })(
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="请选择商户类型"
            dropdownRender={menu => (
              <div>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <Link to={'business'}>
                  <div style={{ padding: '8px', cursor: 'pointer' }}>
                    <Icon type="plus" /> 添加商户类型
                  </div>
                </Link>
              </div>
            )}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children[0].toString().indexOf(input.toString()) != -1
            }
          >
            {businessList}
          </Select>,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="费率">
        {form.getFieldDecorator('rate', {
          rules: [{ required: true, message: '请选择费率！' }],
        })(
          <Select
            style={{ width: '100%' }}
            placeholder="请选择费率"
            //onChange={val => onChange('rate', val)}
            dropdownRender={menu => (
              <div>
                {menu}
                {/* <Divider style={{ margin: '4px 0' }} />
                    <div style={{ padding: '8px', cursor: 'pointer' }}>
                      <Icon type="plus" /> 添加费率
                    </div> */}
              </div>
            )}
          >
            <Option key={30}>0.3%</Option>
            <Option key={38}>0.38%</Option>
            <Option key={53}>0.53%</Option>
            <Option key={55}>0.55%</Option>
            <Option key={58}>0.58%</Option>
            <Option key={60}>0.6%</Option>
            <Option key={64}>0.64%</Option>
          </Select>,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商户名">
        {form.getFieldDecorator('business', {
          rules: [{ message: '请输入商户名称！' }],
        })(
          <AutoComplete
            placeholder="请输入商户名称"
            dataSource={dataSource}
            style={{ width: 260 }}
            onChange={onChangeBusiness}
          />,
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="时间">
        {form.getFieldDecorator('swipe_time', {
          initialValue: moment(),
        })(<DatePicker showTime placeholder="选择时间" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
