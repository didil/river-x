pragma solidity ^0.4.11;

import "./Ownable.sol";

contract TokenRegistry is Ownable {

  /*
   *  Events
   */

  event TokenAdded(string _name, uint8 _decimals, string _symbol, address _contractAddress);
  event TokenRemoved(address _contractAddress);

  /*
   * Storage
   */

  struct TokenInfo {
    string name;
    uint8 decimals;
    string symbol;
    uint id;
  }

  // tokens mapping
  mapping(address => TokenInfo) tokens;

  // token symbols array
  address[] tokenAddresses;

  /*
  * Public functions
  */

  /**
  * @dev Contract constructor
  */
  function TokenRegistry() public {
  }

  /**
  * @dev Add Token
  * @param _name Token name
  * @param _decimals Token decimals
  * @param _symbol Token symbol
  * @param _contractAddress Token contract address
  */
  function addToken(string _name, uint8 _decimals, string _symbol, address _contractAddress) onlyOwner public {
    // avoid overwrite
    require(tokens[_contractAddress].id == 0);

    // add token
    tokens[_contractAddress] = TokenInfo(_name, _decimals, _symbol, tokenAddresses.length + 1);
    tokenAddresses.push(_contractAddress);

    // Log event
    TokenAdded(_name, _decimals, _symbol, _contractAddress);
  }

  /**
  * @dev Remove Token
  * @param _contractAddress Token address
  * @param _id Token id
  */
  function removeToken(address _contractAddress, uint _id) onlyOwner public {
    // remove token data
    delete tokens[_contractAddress];
    // remove address
    delete tokenAddresses[_id - 1];

    // Log event
    TokenRemoved(_contractAddress);
  }

  /**
  * @dev Get Token
  * @param _contractAddress Token address
  */
  function getToken(address _contractAddress) constant returns (string name, uint8 decimals, string symbol, uint id) {
    var tokenInfo = tokens[_contractAddress];
    return (tokenInfo.name, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.id);
  }

  /**
  * @dev Get Token Addresses length
  */
  function getTokenAddressesLength() constant public
  returns (uint length){
    return tokenAddresses.length;
  }

  /**
  * @dev Get token addresses
  */
  function getTokenAddresses() public constant returns (address[])  {
    return tokenAddresses;
  }

}