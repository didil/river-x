const OrderBook = artifacts.require("./OrderBook.sol");
const HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = OrderBook.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('OrderBook', function (accounts) {

  it("create order updates bid/ask and inserts order", async function () {
    const instance = await OrderBook.deployed();
    const tokenInstance = await HumanStandardToken.deployed();
    const tokenAddress = tokenInstance.address;

    await instance.createOrder(tokenAddress, 1, web3.toWei(0.1, "ether"), 1000);
    await instance.createOrder(tokenAddress, 1, web3.toWei(0.3, "ether"), 2000);
    await instance.createOrder(tokenAddress, 1, web3.toWei(0.2, "ether"), 3000, {from: accounts[1]});

    await instance.createOrder(tokenAddress, 2, web3.toWei(0.05, "ether"), 4000);
    await instance.createOrder(tokenAddress, 2, web3.toWei(0.06, "ether"), 2000);

    const ordersLength = await instance.getOrdersLength(tokenAddress);
    assert.equal(ordersLength.toNumber(), 5);

    const order = await instance.getOrder(tokenAddress, 2);

    assert.equal(order[0].toNumber(), 1);
    assert.equal(order[1], web3.toWei(0.2, "ether"));
    assert.equal(order[2].toNumber(), 3000);
    assert.equal(order[3], accounts[1]);
  });

});
