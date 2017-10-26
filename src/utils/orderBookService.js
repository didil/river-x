import OrderBookContract from '../../build/contracts/OrderBook.json'

const contract = require('truffle-contract');

async function loadOrders(web3, tokenContractAddress) {
  const orderBookContract = contract(OrderBookContract);
  orderBookContract.setProvider(web3.currentProvider);

  const instance = await orderBookContract.deployed();

  const ordersLength = await instance.getOrdersLength(tokenContractAddress);

  const orders = [];
  for (let i = 0; i < ordersLength.toNumber(); i++) {
    const values = await instance.getOrder(tokenContractAddress, i + 1);
    orders.push({
      orderType: values[0].toNumber() === 1 ? "buy" : "sell",
      price: values[1].toNumber(),
      amount: values[2].toNumber(),
      userAddress: values[3],
      id: values[4].toNumber()
    });
  }

  return orders;
}


async function getEthBalance(web3, userAddress) {
  const orderBookContract = contract(OrderBookContract);
  orderBookContract.setProvider(web3.currentProvider);

  const instance = await orderBookContract.deployed();

  let ethBalance = await instance.ethBalance(userAddress);

  return ethBalance.toNumber();
}

let orderBookService = {
  loadOrders: loadOrders,
  getEthBalance: getEthBalance,
};

export default orderBookService;