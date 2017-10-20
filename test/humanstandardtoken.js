const HumanStandardToken = artifacts.require("./HumanStandardToken.sol");
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');
const getEventLogs = require('./support/getEventLogs.js');
const catchOpcodeErr = require('./support/catchOpcodeErr.js');

const web3 = HumanStandardToken.web3;
const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

contract('HumanStandardToken', function (accounts) {

  describe("basic token functionality", function () {
    it("transfers", async function () {
      const instance = await HumanStandardToken.deployed();

      const initialBalance = await instance.balanceOf(accounts[0]);
      assert.equal(initialBalance.toNumber(), 5 * Math.pow(10, 18));

      await instance.transfer(accounts[1], 1 * Math.pow(10, 18) , {from: accounts[0]});

      let newBalance0 = await instance.balanceOf(accounts[0]);
      assert.equal(newBalance0.toNumber(), 4 * Math.pow(10, 18));

      let newBalance1 = await instance.balanceOf(accounts[1]);
      assert.equal(newBalance1.toNumber(), Math.pow(10, 18));
    });

  });
});
