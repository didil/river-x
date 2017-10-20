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
    uint orderId;
    }

    address public owner;

    // orders by token
    mapping (address => Order[]) orders;

    event NewOrder(address indexed _tokenAddress, uint _orderType, uint _price, uint _amount, address userAddress, uint orderId);

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

        NewOrder(_tokenAddress,_orderType, _price, _amount, msg.sender, orderId);
    }

    function getOrder(address _tokenAddress, uint _id) constant public
    returns (uint orderType, uint price, uint amount, address userAddress){
        Order memory order = orders[_tokenAddress][_id];
        return (order.orderType, order.price, order.amount, order.userAddress);
    }

    function getOrdersLength(address _tokenAddress) constant public
    returns (uint length){
        return orders[_tokenAddress].length;
    }

}