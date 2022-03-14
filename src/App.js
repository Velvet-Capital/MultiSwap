import React, { Component } from "react";
import Swap from "./abis/Swap.json";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import { Button, Form, Input, Header, HeaderSubheader } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      addressToken1: "",
      addressToken2: "",
      addressToken3: "",
      addressToken4: "",
      addressToken5: "",
      addressToken6: "",
      addressToken7: "",
      addressToken8: "",
      addressToken9: "",
      addressToken10: "",
      address: "",
      amount: 0,
      calculatedOutput: 0,
      value: 0
    }
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // first up is to detect ethereum provider
  async loadWeb3() {
    const provider = await detectEthereumProvider();

    // modern browsers
    if (provider) {
      console.log('Ethereum wallet is connected');

      window.web3 = new Web3(provider);
    } else {
      console.log('No ethereum wallet detected');
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await window.web3.eth.getAccounts();
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId();
    const networkData = Swap.networks[networkId];
    if (networkData) {
      const abi = Swap.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      this.setState({ contract });
    } else {
      window.alert('Smart contract not deployed!')
    }

  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    })
  }

  getQuote = async () => {
    let { address, amount } = this.state;
    let result = await this.state.contract.methods.getExchangeRate(amount, address).call();
    this.setState({
      calculatedOutput: result[1]
    })
  }

  createPortfolio = async () => {

    let portfolio = [
      "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", // CAKE
      "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
      "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F", // Alpaca
      "0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f", // Belt
      "0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51", // Bunny
      "0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096", // NRV
      "0x9f589e3eabe42ebC94A44727b3f3531C0c877809", // TKO
      "0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7", // VAI
      "0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63", // Venus
      "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"  // ETH
    ]
    await this.state.contract.methods.generatePortfolioWith10Assets(portfolio).send({ from: this.state.account, value: this.state.value });
  }

  render() {
    return (
      <div className="App">
        <br></br>
        <Header as='h1'>Velvet.Capital</Header>
        <HeaderSubheader as='h2'>Exchange Rate</HeaderSubheader>
        <Form onSubmit={this.getQuote}>
          <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="TokenAddress" name="address" onChange={this.handleInputChange}></Input><br></br>
          <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Value" name="amount" onChange={this.handleInputChange}></Input><br></br>
          <Button color="green" type="submit" style={{ margin: "20px" }}>Get exchange rate</Button>
        </Form>

        {this.state.calculatedOutput}

        <HeaderSubheader as='h2'>Create a Portfolio with 10 Assets</HeaderSubheader>
        <p>The value will be equally swapped into the following 10 tokens:</p>
        <p>CAKE, BUSD, Alpaca, Belt, Bunny, NRV, TKO, VAI, Venus, ETH</p>
        <Form onSubmit={this.createPortfolio}>
          <Input style={{ width: "600px", padding: 3 }} required type="text" placeholder="Value" name="value" onChange={this.handleInputChange}></Input><br></br>
          <Button color="green" type="submit" style={{ margin: "20px" }}>Generate Portfolio!</Button><br></br>
        </Form>
      </div >
    );
  }
}

export default App;


