import React, { Component } from 'react';
import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,
} from 'antd';

class DnsForm extends Component {

    componentDidMount() {
        const { formData } = this.props;
        console.log('componentdidmount', formData);
        let data = {};
        formData.forEach(field => {
            data[field.key] = field.defaultValue;
        });
        this.props.form.setFieldsValue(data);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    generateFormFields = () => {
        const { formData } = this.props;
        const { getFieldDecorator } = this.props.form;
        return formData.map((field, index) => {
            return (
                <Form.Item label={field.label} key={index}>
                    {getFieldDecorator(field.key, {
                        rules: [{
                            required: true, message: 'Please input a ' + field.label,
                        }]
                    })(
                        <Input disabled={field.disabled} />
                    )}
                </Form.Item>
            );
        });
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 1 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 10,
                },
            },
        };

        const { context } = this.props;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {this.generateFormFields()}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="default" style={{ marginRight: '50px' }} onClick={this.props.cancelHandler}>Cancel</Button>
                    <Button type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedDnsForm = Form.create({ name: 'register' })(DnsForm);
export default WrappedDnsForm;