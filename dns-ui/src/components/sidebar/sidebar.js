import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { capitalizeFirstLetter } from "../../utils";
import './sidebar.css';

const { Sider } = Layout;

const SubMenu = Menu.SubMenu;
class Sidebar extends Component {

    state = {
        collapsed: false
    };

    populateSubMenu = () => {
        const { data } = this.props;
        let renderedSubmenu = data.map((domain, index) => {
            return (
                <SubMenu
                    key={index}
                    title={<span><Icon type="global" /><span>{capitalizeFirstLetter(domain.domainName)}</span></span>}
                >
                    {domain.tlds.map((tld, index) => {
                        return (
                            <Menu.Item key={domain.domainName+'.'+tld} onClick={this.props.onClick}>{tld}</Menu.Item>
                        );
                    })}                    
                </SubMenu>
            );
        });
        return renderedSubmenu;
    }

    render() {
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
            >
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" onClick={this.props.onClick}>
                        <Icon type="bank" />
                        <span>Account</span>
                    </Menu.Item>
                    {this.populateSubMenu()}
                    {/* <SubMenu
                        key="sub1"
                        title={<span><Icon type="global" /><span>Google</span></span>}
                    >
                        <Menu.Item key="3">.com</Menu.Item>
                        <Menu.Item key="4">.lk</Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={<span><Icon type="team" /><span>Team</span></span>}
                    >
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9">
                        <Icon type="file" />
                        <span>File</span>
                    </Menu.Item> */}
                </Menu>
            </Sider>
        );
    }
}

export default Sidebar;
