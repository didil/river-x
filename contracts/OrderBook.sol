pragma solidity ^0.4.11;


import "./HumanStandardToken.sol";
import "./SafeMath.sol";


contract OrderBook {
    using SafeMath for uint;

    struct Order {
    uint orderType; // 1 is buy , 2 is sell
    uint price;
    uint amount;
    address userAddress;
    uint id;
    }

    address public owner;

    // orders by token
    mapping (address => Order[]) public orders;

    // balance in eth by address
    mapping (address => uint) public ethBalance;

    event NewOrder(address indexed _tokenAddress, uint _orderType, uint _price, uint _amount, address userAddress, uint orderId);

    event EthDeposited(address indexed _userAddress, uint _amount);

    event EthWithdrawn(address indexed _userAddress, uint _amount);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function OrderBook() public {
        owner = msg.sender;
    }

    function createOrder(address _tokenAddress, uint _orderType, uint _price, uint _amount) public {
        require(_orderType == 1 || _orderType == 2);

        uint orderId = getOrdersLength(_tokenAddress) + 1;
        Order memory order = Order(_orderType, _price, _amount, msg.sender, orderId);
        orders[_tokenAddress].push(order);

        NewOrder(_tokenAddress, _orderType, _price, _amount, msg.sender, orderId);
    }

    function getOrder(address _tokenAddress, uint _id) constant public
    returns (uint orderType, uint price, uint amount, address userAddress, uint id){
        Order memory order = orders[_tokenAddress][_id - 1];
        return (order.orderType, order.price, order.amount, order.userAddress, order.id);
    }

    function getOrdersLength(address _tokenAddress) constant public
    returns (uint length){
        return orders[_tokenAddress].length;
    }

    function depositEth() public payable {
        ethBalance[msg.sender] = ethBalance[msg.sender].add(msg.value);

        EthDeposited(msg.sender, msg.value);
    }

    function withdrawEth(uint amount) public {
        ethBalance[msg.sender] = ethBalance[msg.sender].sub(amount);

        msg.sender.transfer(amount);

        EthWithdrawn(msg.sender, amount);
    }

}