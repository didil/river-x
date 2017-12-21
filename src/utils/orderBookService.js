import contractService from '../utils/contractService';
const promisify = require("promisify-es6");
const ethUtil = require('ethereumjs-util');


async function loadOrders(web3, tokenAddress) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let ordersLength = await orderBookInstance.getOrdersLength(tokenAddress);

  let orders = [];
  for (let i = 0; i < ordersLength; i++) {
    const orderData = await orderBookInstance.getOrder(tokenAddress, i + 1);

    let executed = orderData[5];
    let canceled = orderData[6];
    if (!executed && !canceled) {
      orders.push({
        orderType: orderData[0].toNumber(),
        price: orderData[1].toNumber(),
        amount: orderData[2].toNumber(),
        userAddress: orderData[3],
        id: orderData[4].toNumber(),
        tokenAddress: tokenAddress
      });
    }
  }

  return orders;
}


async function loadBalances(web3, tokenAddress) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");
  const tokenInstance = await contractService.getInstanceAt(web3, "HumanStandardToken", tokenAddress);

  const tokenBalance = await orderBookInstance.tokenBalanceOf(tokenAddress, web3.eth.defaultAccount);
  const walletTokenBalance = await tokenInstance.balanceOf(web3.eth.defaultAccount);

  const ethBalance = await orderBookInstance.ethBalanceOf(web3.eth.defaultAccount);
  const walletEthBalance = await promisify(web3.eth.getBalance)(web3.eth.defaultAccount);


  return {
    tokenBalance: tokenBalance.toNumber(),
    walletTokenBalance: walletTokenBalance.toNumber(),
    ethBalance: ethBalance.toNumber(),
    walletEthBalance: walletEthBalance.toNumber(),
  };
}

async function depositTokens(web3, tokenAddress, amount) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");
  const tokenInstance = await contractService.getInstanceAt(web3, "HumanStandardToken", tokenAddress);

  tokenInstance.increaseApproval(orderBookInstance.address, amount, {gas: 300000});
  let results = await orderBookInstance.depositTokens(tokenAddress, amount, {gas: 300000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }

  return results;
}

async function withdrawTokens(web3, tokenAddress, amount) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.withdrawTokens(tokenAddress, amount, {gas: 300000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }

  return results;
}

async function depositEth(web3, amount) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.depositEth({value: web3.toWei(amount, "ether"), gas: 200000});
  return results;
}

async function withdrawEth(web3, amount) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.withdrawEth(web3.toWei(amount, "ether"), {gas: 200000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }

  return results;
}

async function createOrder(web3, orderData) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.createOrder(orderData.tokenAddress, orderData.orderType, orderData.fullDecimalsPrice, orderData.fullDecimalsAmount, {gas: 200000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }

  return results;
}

async function cancelOrder(web3, tokenAddress, orderId) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.cancelOrder(tokenAddress, orderId, {gas: 200000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }
  
  return results;
}

async function takeOrder(web3, tokenAddress, orderId) {
  const orderBookInstance = await contractService.getDeployedInstance(web3, "OrderBook");

  let results = await orderBookInstance.takeOrder(tokenAddress, orderId, {gas: 200000});

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed");
  }
  
  return results;
}

let orderBookService = {
  loadOrders,
  loadBalances,
  depositTokens,
  withdrawTokens,
  depositEth,
  withdrawEth,
  createOrder,
  cancelOrder,
  takeOrder,
};

export default orderBookService;