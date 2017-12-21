pragma solidity ^0.4.11;


import "./HumanStandardToken.sol";
import "./SafeMath.sol";
import "./Ownable.sol";

contract OrderBook is Ownable {
  using SafeMath for uint;

  /*
   *  Events
   */

  event NewOrder(address indexed _tokenAddress, uint _orderType, uint _price, uint _amount, address _userAddress, uint _orderId);
  event OrderCanceled(address indexed _tokenAddress, uint _orderId);
  event OrderTaken(address indexed _tokenAddress, uint _orderId, address _userAddress);
  event EthDeposited(address indexed _userAddress, uint _amount);
  event EthWithdrawn(address indexed _userAddress, uint _amount);
  event TokenDeposit(address indexed _userAddress, address indexed _tokenAddress, uint _amount);
  event TokenWithdrawal(address indexed _userAddress, address indexed _tokenAddress, uint _amount);

  /*
   * Storage
   */

  struct Order {
    uint orderType; // 1 is buy , 2 is sell
    uint price;
    uint amount;
    address userAddress;
    uint id;
    bool canceled;
    bool executed;
  }

  // orders by token
  mapping(address => Order[]) public orders;

  // eth balance by user address
  mapping(address => uint) public ethBalances;

  // token balance by user address by token address
  mapping(address => mapping(address => uint)) public tokenBalances;

  /*
   * Public functions
   */

  /**
  * @dev Contract constructor
  */
  function OrderBook() public {
  }

  /**
  * @dev create order
  * @param _tokenAddress Token Address
  * @param _orderType Order Type (buy or sell)
  * @param _price Price in wei
  * @param _amount Amount to deposit
  */
  function createOrder(address _tokenAddress, uint _orderType, uint _price, uint _amount) public {
    // check valid order type
    require(_orderType == 1 || _orderType == 2);

    // check balance sufficient
    require(checkBalance(true, _tokenAddress, _orderType, _price, _amount));

    // create order
    uint orderId = getOrdersLength(_tokenAddress) + 1;
    Order memory order = Order(_orderType, _price, _amount, msg.sender, orderId, false, false);
    orders[_tokenAddress].push(order);

    // Log event
    NewOrder(_tokenAddress, _orderType, _price, _amount, msg.sender, orderId);
  }

  /**
  * @dev Cancel order
  * @param _tokenAddress Token Address
  * @param _id Order id
  */
  function cancelOrder(address _tokenAddress, uint _id) public {
    Order memory order = orders[_tokenAddress][_id - 1];

    // check order exists and not canceled or executed
    require(order.id > 0 && !order.executed && !order.canceled);
    // check order belongs to sender
    require(order.userAddress == msg.sender);

    // cancel order
    orders[_tokenAddress][_id - 1].canceled = true;

    // Log event
    OrderCanceled(_tokenAddress, _id);
  }

  /**
   * @dev Take order
   * @param _tokenAddress Token Address
   * @param _id Order id
   */
  function takeOrder(address _tokenAddress, uint _id) public {
    Order memory order = orders[_tokenAddress][_id - 1];

    // check order exists and not canceled or executed
    require(order.id > 0 && !order.executed && !order.canceled);
    // check order does not belongs to sender
    require(order.userAddress != msg.sender);
    // check balance is sufficient
    require(checkBalance(false, _tokenAddress, order.orderType, order.price, order.amount));

    address makerAddress = order.userAddress;
    address takerAddress = msg.sender;
    uint dealPrice = order.price * order.amount;

    // take order
    if (order.orderType == 1) { // Buy order
      // add tokens to the maker's balance
      tokenBalances[_tokenAddress][makerAddress] = tokenBalances[_tokenAddress][makerAddress].add(order.amount);
      // withdraw tokens from the taker's balance
      tokenBalances[_tokenAddress][takerAddress] = tokenBalances[_tokenAddress][takerAddress].sub(order.amount);

      // add eth to the taker's balance
      ethBalances[takerAddress] = ethBalances[takerAddress].add(dealPrice);
      // withdraw eth from the maker's locked balance
      ethBalances[makerAddress] = ethBalances[makerAddress].sub(dealPrice);
    }
    else {
      // add tokens to the taker's balance
      tokenBalances[_tokenAddress][takerAddress] = tokenBalances[_tokenAddress][takerAddress].add(order.amount);
      // withdraw tokens from the maker's locked balance
      tokenBalances[_tokenAddress][makerAddress] = tokenBalances[_tokenAddress][makerAddress].sub(order.amount);

      // add eth to the maker's balance
      ethBalances[makerAddress] = ethBalances[makerAddress].add(dealPrice);
      // withdraw eth from the taker's balance
      ethBalances[takerAddress] = ethBalances[takerAddress].sub(dealPrice);
    }

    // make sure balances are still positive
    assert(tokenBalances[_tokenAddress][makerAddress] >= 0);
    assert(ethBalances[makerAddress] >= 0);

    assert(tokenBalances[_tokenAddress][takerAddress] >= 0);
    assert(ethBalances[takerAddress] >= 0);

    // mark order executed
    orders[_tokenAddress][_id - 1 ].executed = true;

    // Log event
    OrderTaken(_tokenAddress, _id, msg.sender);
  }

  /**
  * @dev fetch order
  * @param _tokenAddress Token Address
  * @param _id order id
  */
  function getOrder(address _tokenAddress, uint _id) constant public
  returns (uint orderType, uint price, uint amount, address userAddress, uint id, bool canceled, bool executed){
    Order memory order = orders[_tokenAddress][_id - 1];
    return (order.orderType, order.price, order.amount, order.userAddress, order.id, order.canceled, order.executed);
  }

  /**
  * @dev get number of orders by token
  * @param _tokenAddress Token Address
  */
  function getOrdersLength(address _tokenAddress) constant public
  returns (uint length){
    return orders[_tokenAddress].length;
  }

  /**
  * @dev deposit Eth to contract
  */
  function depositEth() public payable {
    // save amount to user's eth balance
    ethBalances[msg.sender] = ethBalances[msg.sender].add(msg.value);

    // Log event
    EthDeposited(msg.sender, msg.value);
  }

  /**
  * @dev withdraw Eth to user's balance
  * @param _amount amount
  */
  function withdrawEth(uint _amount) public {
    // withdraw amount from user's eth balance
    ethBalances[msg.sender] = ethBalances[msg.sender].sub(_amount);

    // transfer eth amount to user's wallet
    msg.sender.transfer(_amount);

    // Log event
    EthWithdrawn(msg.sender, _amount);
  }

  /**
  * @dev deposit tokens into the contract
  * @param _token Token Address
  * @param _amount Amount to deposit
  */
  function depositTokens(HumanStandardToken _token, uint _amount) public {
    require(_amount > 0);

    // token.approve needs to be called beforehand
    // transfer tokens from the user to the contract
    require(_token.transferFrom(msg.sender, this, _amount));

    // add the tokens to the user's balance
    tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].add(_amount);

    // Log event
    TokenDeposit(msg.sender, address(_token), _amount);
  }

  /**
  * @dev withdraw tokens from the contract
  * @param _token Token Address
  * @param _amount Amount to withdraw
  */
  function withdrawTokens(HumanStandardToken _token, uint _amount) public {
    require(tokenBalances[address(_token)][msg.sender] >= _amount);

    // subtract the tokens from the user's balance
    tokenBalances[address(_token)][msg.sender] = tokenBalances[address(_token)][msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    require(_token.transfer(msg.sender, _amount));

    // Log event
    TokenWithdrawal(msg.sender, address(_token), _amount);
  }

  /**
  * @dev Check Balance
  * @param _isMaker Is the user making or taking an order
  * @param _tokenAddress Token Address
  * @param _orderType Order Type
  * @param _price Price
  * @param _amount Amount
  */
  function checkBalance(bool _isMaker, address _tokenAddress, uint _orderType, uint _price, uint _amount) constant public returns (bool){
    if (_isMaker) {
      if (_orderType == 1) {
        return _price.mul(_amount) <= ethBalanceOf(msg.sender);
      }
      else {
        return _amount <= tokenBalanceOf(_tokenAddress, msg.sender);
      }
    }
    else {
      if (_orderType == 2) {
        return _price.mul(_amount) <= ethBalanceOf(msg.sender);
      }
      else {
        return _amount <= tokenBalanceOf(_tokenAddress, msg.sender);
      }
    }
  }

  /**
  * @dev Get user eth balance
  * @param _userAddress User Address
  */
  function ethBalanceOf(address _userAddress) constant public returns (uint) {
    return ethBalances[_userAddress];
  }

  /**
  * @dev Get user token balance
  * @param _tokenAddress Token Contract Address
  * @param _userAddress User Address
  */
  function tokenBalanceOf(address _tokenAddress, address _userAddress) constant public returns (uint) {
    return tokenBalances[_tokenAddress][_userAddress];
  }

}