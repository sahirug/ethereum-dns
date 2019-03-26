import React, { Component } from 'react';
import { Layout, Breadcrumb, Statistic, Row, Col, Button } from 'antd';

const { Content } = Layout;

class DnsContent extends Component {

    state = {
        collapsed: false
    };

    renderProfile = () => {
        return (
            <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Accounts</Breadcrumb.Item>
                    <Breadcrumb.Item>0x90Ed0334018BB086226475906d815a402c2909cd</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: "#fff", minHeight: "80vh" }}>
                    <Row gutter={16}>
                        <Col span={10}>
                            <Statistic title="Account Address" value={'0x90Ed0334018BB086226475906d815a402c2909cd'} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Account Balance (ETH)" value={112893} precision={2} />
                        </Col>
                        <Col span={4}>
                            <Statistic title="Registered Domains" value={2} />
                        </Col>
                    </Row>
                </div>
            </Content>
        );
    }

    renderIps = () => {
        return (
            <Content style={{ margin: "0 16px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
                    Bill is a cat.
                </div>
            </Content>
        );
    }

    render() {
        const { type } = this.props;
        return (
            type === 'profile' ? this.renderProfile() : this.renderIps()  
        );
    }
}

export default DnsContent;
