const OrderBook = artifacts.require("./OrderBook.sol");
const HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = OrderBook.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('OrderBook', function (accounts) {

  it("deposit/withdraw eth", async function () {
    const instance = await OrderBook.deployed();

    await instance.depositEth({from: accounts[0], value: web3.toWei(0.2,"ether")});

    let contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance, web3.toWei(0.2,"ether"));

    let account0ContractBalance = await instance.ethBalance(accounts[0]);
    assert.equal(account0ContractBalance.toNumber(), web3.toWei(0.2,"ether"));

    await instance.depositEth({from: accounts[1], value: web3.toWei(0.3,"ether")});

    contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance.toNumber(), web3.toWei(0.5,"ether"));

    let account1ContractBalance = await instance.ethBalance(accounts[1]);
    assert.equal(account1ContractBalance.toNumber(), web3.toWei(0.3,"ether"));

    let account1Balance = await proxiedWeb3.eth.getBalance(accounts[1]);
    assert.isAbove(account1Balance.toNumber(), web3.toWei(99.69,"ether"));
    assert.isBelow(account1Balance.toNumber(), web3.toWei(99.7,"ether"));
    // check ether was sent (accounting for gas)

    await instance.withdrawEth(web3.toWei(0.1,"ether") , {from: accounts[1]});
    account1Balance = await proxiedWeb3.eth.getBalance(accounts[1]);
    assert.isAbove(account1Balance.toNumber(), web3.toWei(99.79,"ether"));
    assert.isBelow(account1Balance.toNumber(), web3.toWei(99.8,"ether"));

    contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance.toNumber(), web3.toWei(0.4,"ether"));
  });

  it("create order updates bid/ask and inserts order", async function () {
    const instance = await OrderBook.deployed();
    const tokenInstance = await HumanStandardToken.deployed();
    const tokenAddress = tokenInstance.address;

    await instance.createOrder(tokenAddress, 1, web3.toWei(0.1, "ether"), 1000);
    await instance.createOrder(tokenAddress, 1, web3.toWei(0.3, "ether"), 2000);
    await instance.createOrder(tokenAddress, 1, web3.toWei(0.2, "ether"), 3000, {from: accounts[1]});

    await instance.createOrder(tokenAddress, 2, web3.toWei(0.5, "ether"), 4000);
    await instance.createOrder(tokenAddress, 2, web3.toWei(0.6, "ether"), 2000);

    const ordersLength = await instance.getOrdersLength(tokenAddress);
    assert.equal(ordersLength.toNumber(), 5);

    const order = await instance.getOrder(tokenAddress, 3);

    assert.equal(order[0].toNumber(), 1);
    assert.equal(order[1], web3.toWei(0.2, "ether"));
    assert.equal(order[2].toNumber(), 3000);
    assert.equal(order[3], accounts[1]);
    assert.equal(order[4], 3);
  });



});
