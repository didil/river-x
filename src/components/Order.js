import React, {Component} from 'react'

const _ = require('lodash');

import * as orderBookActions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class Order extends Component {

  cancelOrder(orderId){
    this.props.orderBookActions.cancelOrder({orderId:orderId, tokenAddress: this.props.tokenAddress});
  }

  takeOrder(orderId){
    this.props.orderBookActions.takeOrder({orderId:orderId, tokenAddress: this.props.tokenAddress});
  }

  render() {
    let {order, navbarReducer ,orderBookReducer,tokenRegistryReducer} = this.props;
    let web3 = navbarReducer.get("web3");
    let ownAddress = web3.eth.defaultAccount;
    let decimals = tokenRegistryReducer.get('selectedToken').decimals;

    return (
      <tr>
        <td>{web3.fromWei(order.price * Math.pow(10, decimals), 'ether')}</td>
        <td>{order.amount / Math.pow(10, decimals)}</td>
        <td>{order.userAddress.substring(0, 10) + "***"}</td>
        <td>
          {order.userAddress === ownAddress ?
            <button type="button" className="btn btn-sm btn-danger"
                    onClick={() => this.cancelOrder(order.id)}
                    disabled={orderBookReducer.get("cancellingOrder") || orderBookReducer.get("takingOrder")}>
              Cancel
            </button> :
            <button type="button" className="btn btn-sm btn-info"
                    onClick={() => this.takeOrder(order.id)}
                    disabled={orderBookReducer.get("cancellingOrder") || orderBookReducer.get("takingOrder")}>
              Take
            </button>
          }

          {orderBookReducer.get("cancellingOrder") === order.id ? <em>Cancelling ...</em> : null}
          {orderBookReducer.get("takingOrder") === order.id ? <em>Taking ...</em> : null}
        </td>
      </tr>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    navbarReducer: state.navbarReducer,
    orderBookReducer: state.orderBookReducer,
    tokenRegistryReducer: state.tokenRegistryReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    orderBookActions: bindActionCreators(orderBookActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Order);