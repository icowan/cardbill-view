import {Form, Input, Modal, Select, Icon, Divider, InputNumber, Row, Col} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';
import {BankType} from '@/types/bank';
import {CreditCardType} from '@/types/creditcard';

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: CreditCardType) => void;
  handleModalVisible: () => void;
  banks: BankType[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {modalVisible, form, handleAdd, handleModalVisible, banks} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  let bankList = [];
  for (let i in banks) {
    bankList.push(
      <Option key={`bank-${banks[i].id}`} value={banks[i].id}>
        {banks[i].bank_name}
      </Option>,
    );
  }

  let days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(
      <Option key={`day-${i}`} value={i}>
        {i}
      </Option>,
    );
  }

  return (
    <Modal
      destroyOnClose
      title="增加消费记录"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="信用卡" style={{marginBottom: 0}}>
        <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
          {form.getFieldDecorator('bank_id', {
            rules: [{required: true, message: '请选择一家银行！'}],
          })(
            <Select
              style={{width: '100%'}}
              placeholder="请选择银行"
              dropdownRender={menu => (
                <div>
                  {menu}
                  <Divider style={{margin: '4px 0'}}/>
                  <div style={{padding: '8px', cursor: 'pointer'}}>
                    <Icon type="plus"/> 添加银行
                  </div>
                </div>
              )}
            >
              {bankList}
            </Select>,
          )}
        </FormItem>
        <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>-</span>
        <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
          {form.getFieldDecorator('card_name', {
            rules: [{required: true, message: '请输入信用卡名!', max: 255}],
          })(<Input placeholder="请输入信用卡名!"/>)}
        </FormItem>
      </FormItem>


      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="卡末四位">
        {form.getFieldDecorator('tail_number', {
          rules: [
            {type: 'number', min: 1, max: 9999},
          ],
        })(
          <InputNumber
            style={{width: 120}}
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="5162"
            min={1000}
            max={9999}
          />,
        )}
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="固定额度">
        {form.getFieldDecorator('fixed_amount', {
          rules: [
            {required: true, type: 'number', message: '请输入固定额度！', min: 1, max: 999999},
          ],
        })(
          <InputNumber
            style={{width: 120}}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="额度"
            prefix="￥"
            min={1}
            max={99999}
            suffix="RMB"
          />,
        )}
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="临时额度">
        {form.getFieldDecorator('max_amount', {
          rules: [
            {required: true, type: 'number', message: '请输入临时额度！', min: 1, max: 999999},
          ],
        })(
          <InputNumber
            style={{width: 120}}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="额度"
            prefix="￥"
            min={1}
            max={99999}
            suffix="RMB"
          />,
        )}
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账单还款日" style={{marginBottom: 0}}>
        <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
          {form.getFieldDecorator('billing_day', {
            rules: [{required: true, type: 'number', message: '请选择账单日！', min: 1, max: 31}],
          })(
            <Select style={{width: '100%'}} placeholder="请选择账单日">
              {days}
            </Select>,
          )}
        </FormItem>
        <span style={{display: 'inline-block', width: '24px', textAlign: 'center'}}>-</span>
        <FormItem style={{display: 'inline-block', width: 'calc(50% - 12px)'}}>
          {form.getFieldDecorator('cardholder', {
            rules: [{required: true, type: 'number', message: '请选择还款日！', min: 1, max: 31}],
          })(
            <Select style={{width: '100%'}} placeholder="请选择还款日">
              {days}
            </Select>,
          )}
        </FormItem>
      </FormItem>

    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
