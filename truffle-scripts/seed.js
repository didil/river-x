var HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
var TokenRegistry = artifacts.require("./TokenRegistry.sol");
var OrderBook = artifacts.require("./OrderBook.sol");

async function run() {
  const web3 = OrderBook.web3;
  const accounts = web3.eth.accounts;

  const tokenInstance = await HumanStandardToken.deployed();
  const registryInstance = await TokenRegistry.deployed();
  const orderBookInstance = await OrderBook.deployed();

  registryInstance.addToken("River X Token", 3, "RXT", tokenInstance.address);
  console.log("TokenRegistry: Added River X Token");

  await orderBookInstance.createOrder(tokenInstance.address, 1, web3.toWei(0.1, "ether"), 1000);
  await orderBookInstance.createOrder(tokenInstance.address, 1, web3.toWei(0.3, "ether"), 2000);
  await orderBookInstance.createOrder(tokenInstance.address, 1, web3.toWei(0.2, "ether"), 3000);

  await orderBookInstance.createOrder(tokenInstance.address, 2, web3.toWei(0.6, "ether"), 2000, {from: accounts[1]});
  await orderBookInstance.createOrder(tokenInstance.address, 2, web3.toWei(0.5, "ether"), 4000, {from: accounts[1]});

  console.log("OrderBook: Created Orders");
}

module.exports = function (callback) {
  try {
    run().then(() => {
      callback();
    })
  }
  catch (err) {
    callback(err);
  }
};


