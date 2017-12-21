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

    await instance.depositEth({from: accounts[0], value: web3.toWei(2, "ether")});

    let contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance, web3.toWei(2, "ether"));

    let account0ContractBalance = await instance.ethBalanceOf(accounts[0]);
    assert.equal(account0ContractBalance.toNumber(), web3.toWei(2, "ether"));

    await instance.depositEth({from: accounts[1], value: web3.toWei(3, "ether")});

    contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance.toNumber(), web3.toWei(5, "ether"));

    let account1ContractBalance = await instance.ethBalanceOf(accounts[1]);
    assert.equal(account1ContractBalance.toNumber(), web3.toWei(3, "ether"));

    let account1Balance = await proxiedWeb3.eth.getBalance(accounts[1]);
    assert.isAbove(account1Balance.toNumber(), web3.toWei(96.9, "ether"));
    assert.isBelow(account1Balance.toNumber(), web3.toWei(97, "ether"));
    // check ether was sent (accounting for gas)

    await instance.withdrawEth(web3.toWei(1, "ether"), {from: accounts[1]});

    account1ContractBalance = await instance.ethBalanceOf(accounts[1]);
    assert.equal(account1ContractBalance.toNumber(), web3.toWei(2, "ether"));

    account1Balance = await proxiedWeb3.eth.getBalance(accounts[1]);
    assert.isAbove(account1Balance.toNumber(), web3.toWei(97.9, "ether"));
    assert.isBelow(account1Balance.toNumber(), web3.toWei(98, "ether"));

    contractBalance = await proxiedWeb3.eth.getBalance(instance.address);
    assert.equal(contractBalance.toNumber(), web3.toWei(4, "ether"));
  });

  describe('deposit/withdraw tokens', function depositWithdrawTokensTest() {

    before(async function beforeTest() {
      const tokenInstance = await HumanStandardToken.deployed();
      await tokenInstance.transfer(accounts[1], 1000, {from: accounts[0]});
    });

    it('ok', async function it() {
      const instance = await OrderBook.deployed();
      const tokenInstance = await HumanStandardToken.deployed();

      await tokenInstance.approve(instance.address, 50, {from: accounts[0]});
      await instance.depositTokens(tokenInstance.address, 50, {from: accounts[0]});

      let contractBalance = await tokenInstance.balanceOf(instance.address);
      assert.equal(contractBalance, 50);

      let account0ContractBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[0]);
      assert.equal(account0ContractBalance.toNumber(), 50);

      let account0TokenBalance = await tokenInstance.balanceOf(accounts[0]);
      assert.equal(account0TokenBalance.toNumber(), 48950);

      await tokenInstance.approve(instance.address, 80, {from: accounts[1]});
      await instance.depositTokens(tokenInstance.address, 80, {from: accounts[1]});

      contractBalance = await tokenInstance.balanceOf(instance.address);
      assert.equal(contractBalance, 130);

      let account1ContractBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[1]);
      assert.equal(account1ContractBalance.toNumber(), 80);

      let account1TokenBalance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account1TokenBalance.toNumber(), 920);

      await instance.withdrawTokens(tokenInstance.address, 10, {from: accounts[1]});

      contractBalance = await tokenInstance.balanceOf(instance.address);
      assert.equal(contractBalance, 120);

      account1ContractBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[1]);
      assert.equal(account1ContractBalance.toNumber(), 70);

      account1TokenBalance = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(account1TokenBalance.toNumber(), 930);
    });
  });


  describe('createOrder', function createOrderTest() {
    it("create order updates bid/ask and inserts order", async function () {
      const instance = await OrderBook.deployed();
      const tokenInstance = await HumanStandardToken.deployed();
      const tokenAddress = tokenInstance.address;

      await instance.createOrder(tokenAddress, 1, web3.toWei(0.1, "ether"), 5);
      await instance.createOrder(tokenAddress, 1, web3.toWei(0.3, "ether"), 6);
      await instance.createOrder(tokenAddress, 1, web3.toWei(0.2, "ether"), 7, {from: accounts[1]});

      await instance.createOrder(tokenAddress, 2, web3.toWei(0.5, "ether"), 1);
      await instance.createOrder(tokenAddress, 2, web3.toWei(0.6, "ether"), 2);

      const ordersLength = await instance.getOrdersLength(tokenAddress);
      assert.equal(ordersLength.toNumber(), 5);

      const order = await instance.getOrder(tokenAddress, 3);

      assert.equal(order[0].toNumber(), 1);
      assert.equal(order[1], web3.toWei(0.2, "ether"));
      assert.equal(order[2].toNumber(), 7);
      assert.equal(order[3], accounts[1]);
      assert.equal(order[4], 3);
      assert.equal(order[5], false);
      assert.equal(order[6], false);
    });
  });

  describe('cancelOrder', function cancelOrderTest() {
    it("ok", async function () {
      const instance = await OrderBook.deployed();
      const tokenInstance = await HumanStandardToken.deployed();
      const tokenAddress = tokenInstance.address;

      await instance.cancelOrder(tokenAddress, 2);

      const order = await instance.getOrder(tokenAddress, 2);

      assert.equal(order[0].toNumber(), 1);
      assert.equal(order[1], web3.toWei(0.3, "ether"));
      assert.equal(order[2].toNumber(), 6);
      assert.equal(order[3], accounts[0]);
      assert.equal(order[4].toNumber(), 2);
      assert.equal(order[5], true);
      assert.equal(order[6], false);
    });
  });

  describe('takeOrder', function cancelOrderTest() {
    it("buy order ok", async function () {
      const instance = await OrderBook.deployed();
      const tokenInstance = await HumanStandardToken.deployed();
      const tokenAddress = tokenInstance.address;

      await instance.takeOrder(tokenAddress, 3);

      const order = await instance.getOrder(tokenAddress, 3);

      assert.equal(order[0].toNumber(), 1);
      assert.equal(order[1], web3.toWei(0.2, "ether"));
      assert.equal(order[2].toNumber(), 7);
      assert.equal(order[3], accounts[1]);
      assert.equal(order[4], 3);
      assert.equal(order[5], false);
      assert.equal(order[6], true);

      let account0EthBalance = await instance.ethBalanceOf(accounts[0]);
      assert.equal(account0EthBalance.toNumber(), web3.toWei(3.4, "ether"));

      let account1EthBalance = await instance.ethBalanceOf(accounts[1]);
      assert.equal(account1EthBalance.toNumber(), web3.toWei(0.6, "ether"));

      let account0TokenBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[0]);
      assert.equal(account0TokenBalance.toNumber(), 43);

      let account1TokenBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[1]);
      assert.equal(account1TokenBalance.toNumber(), 77);
    });

    it("sell order ok", async function () {
      const instance = await OrderBook.deployed();
      const tokenInstance = await HumanStandardToken.deployed();
      const tokenAddress = tokenInstance.address;

      await instance.takeOrder(tokenAddress, 4, {from: accounts[1]});

      const order = await instance.getOrder(tokenAddress, 4);

      assert.equal(order[0].toNumber(), 2);
      assert.equal(order[1], web3.toWei(0.5, "ether"));
      assert.equal(order[2].toNumber(), 1);
      assert.equal(order[3], accounts[0]);
      assert.equal(order[4], 4);
      assert.equal(order[5], false);
      assert.equal(order[6], true);

      let account0EthBalance = await instance.ethBalanceOf(accounts[0]);
      assert.equal(account0EthBalance.toNumber(), web3.toWei(3.9, "ether"));

      let account1EthBalance = await instance.ethBalanceOf(accounts[1]);
      assert.equal(account1EthBalance.toNumber(), web3.toWei(0.1, "ether"));

      let account0TokenBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[0]);
      assert.equal(account0TokenBalance.toNumber(), 42);

      let account1TokenBalance = await instance.tokenBalanceOf(tokenInstance.address, accounts[1]);
      assert.equal(account1TokenBalance.toNumber(), 78);
    });
  });

});
