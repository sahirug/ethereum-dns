import React, { Component } from 'react';
import Web3 from "web3";
// import logo from './logo.svg';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import { Layout } from 'antd';
import DnsContent from './components/content/content';
import { abi, address } from "./config";
import { keepOnlyCharacters } from "./utils";

const { Header, Footer } = Layout;
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const ddns = new web3.eth.Contract(abi, address);
class App extends Component {

  state = {
    account: 'f',
    viewType: 'profile',
    domains: []
  };

  componentWillMount() {
    this.getAccount();
  }

  getAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0]
    });
    let domains = this.getAccountDetails().then(domains => console.log(domains));    
    // console.log('domains: ', domains);
    // this.setState({
    //   domains
    // });
  }

  getAccountDetails = async () => {
    const { account, domains } = this.state;
    let acc = await web3.eth.accounts[0];
    console.log('account: ', account);
    let domainsFromBlockchain = await ddns.methods.getDomainsForAddress(account).call();
    domainsFromBlockchain = domainsFromBlockchain.map(async (domain) => {
      let tlds = await ddns.methods.getTldForDomain(domain).call();
      tlds = tlds.map(tld => {
        tld = web3.utils.hexToAscii(tld);
        return keepOnlyCharacters(tld);
      });
      domain =  web3.utils.hexToAscii(domain);
      let obj = {
        domainName: keepOnlyCharacters(domain),
        tlds: tlds
      };
      domains.push(obj);
      this.setState({
        domains
      });
    });
    return domainsFromBlockchain;
  }

  handleMenuClick = (val) => {
    let viewType = 'profile';
    if(val.key != 1) {
      viewType = 'ips';
    }
    this.setState({
      viewType
    });
  }

  render() {
    const { viewType } = this.state;
    let { domains } = this.state;
    if(domains == undefined) {
      domains = [];
    }
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar 
          onClick={this.handleMenuClick}
          data={domains}
        />
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <div style={{ marginLeft: 15 }}>
              <h1>Account: </h1>
            </div>
          </Header>
          <DnsContent type={viewType}/>
          <Footer style={{ textAlign: "center" }}>
            EthDNS ©2019 Created by sahirug@gmail.com
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
