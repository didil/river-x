const HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
const TokenRegistry = artifacts.require("./TokenRegistry.sol");
const OrderBook = artifacts.require("./OrderBook.sol");

async function run() {
  const web3 = OrderBook.web3;
  const accounts = web3.eth.accounts;

  const tokenInstance = await HumanStandardToken.deployed();
  const registryInstance = await TokenRegistry.deployed();
  const orderBookInstance = await OrderBook.deployed();

  registryInstance.addToken("River X Token", 3, "RXT", tokenInstance.address);
  console.log("TokenRegistry: Added River X Token");
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


