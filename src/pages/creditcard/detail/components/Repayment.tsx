import {Form, Input, Modal, Select, Icon, Divider, InputNumber, Row, Col} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';
import {CreditCardType} from '@/types/creditcard';
import {BillType} from "@/types/bill";
import {RepaymentState} from "@/pages/creditcard/detail/data";
import moment from "moment";

const FormItem = Form.Item;
const Option = Select.Option;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleRepayment: (fieldsValue: RepaymentState) => void;
  handleModalVisible: (isShow: boolean, currBill: BillType) => void;
  bill: BillType;
  card: CreditCardType;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {modalVisible, form, handleRepayment, handleModalVisible, bill, card} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      fieldsValue.card_id = card.id;
      if (err) return;
      form.resetFields();
      handleRepayment(fieldsValue);
    });
  };

  if (!modalVisible) {
    return ('')
  }


  return (
    <Modal
      destroyOnClose
      title="还款"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible(false, null)}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="信用卡">
        <Input
          value={card.card_name}
          disabled={true}
        />
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="卡末四位">
        <InputNumber
          style={{width: 120}}
          value={card.tail_number}
          disabled={true}
        />
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="账单金额">
        <Input
          style={{width: 220}}
          value={bill.amount}
          disabled={true}
          addonAfter="人民币"
        />
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="还款日">
        {form.getFieldDecorator('repayment', {
          initialValue: moment(new Date(bill.repayment_day)).format('YYYY-MM-DD'),
          rules: [
            {required: true, message: '请输入临时额度！', min: 1, max: 999999},
          ],
        })(
          <Input
            disabled={true}
          />)}
      </FormItem>

      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="还款金额">
        {form.getFieldDecorator('amount', {
          initialValue: bill.amount,
          rules: [
            {required: true, type: 'number', message: '请输入临时额度！', min: 1, max: 999999},
          ],
        })(
          <InputNumber
            style={{width: 140}}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="还款金额"
            prefix="￥"
            min={1}
            max={99999}
            suffix="人民币"
          />)}
      </FormItem>


    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
