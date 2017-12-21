import React, {Component} from 'react'

import * as actions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import BalanceForms from './BalanceForms';
import NewOrderForm from './NewOrderForm';
import Order from './Order';

const _ = require('lodash');

class OrderBook extends Component {
  componentDidMount() {
    let selectedToken = this.props.tokenRegistryReducer.get("selectedToken");
    if (!selectedToken) {
      return this.props.actions.goToHome();
    }

    this.props.actions.loadOrders();
    this.props.actions.loadBalances();
  }

  getBuyOrders(orders) {
    return orders.filter((order) => order.orderType === 1).sort((a, b) => b.price - a.price);
  }

  getSellOrders(orders) {
    return orders.filter((order) => order.orderType === 2).sort((a, b) => a.price - b.price);
  }

  getBid(orders) {
    let decimals = this.props.tokenRegistryReducer.get('selectedToken').decimals;
    let web3 = this.props.navbarReducer.get("web3");

    let buyOrders = this.getBuyOrders(orders);

    if (_.isEmpty(buyOrders)) {
      return null;
    }

    return web3.fromWei(buyOrders[0].price * Math.pow(10, decimals), 'ether');
  }

  getAsk(orders) {
    let decimals = this.props.tokenRegistryReducer.get('selectedToken').decimals;
    let web3 = this.props.navbarReducer.get("web3");

    let sellOrders = this.getSellOrders(orders);

    if (_.isEmpty(sellOrders)) {
      return null;
    }

    return web3.fromWei(sellOrders[0].price * Math.pow(10, decimals), 'ether');
  }

  render() {
    let {orderBookReducer, navbarReducer, tokenRegistryReducer} = this.props;
    let web3 = navbarReducer.get("web3");
    let selectedToken = tokenRegistryReducer.get('selectedToken');

    if (!web3 || !selectedToken) {
      return null;
    }

    let orders = orderBookReducer.get("orders");
    let balances = orderBookReducer.get("balances");

    return (
      <div id="page-wrapper" className="Home">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-header">
                Order Book
              </h1>
            </div>
          </div>

          {orderBookReducer.get('loadingBalances') ?
            "Loading Balances ..."
            :
            <div className="row">
              <div className="col-lg-3">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Balance (ETH)
                    </h4>
                  </div>
                </div>
                <div className="panel-body">
                  {web3.fromWei(balances.ethBalance, 'ether')}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Wallet Balance (ETH)
                    </h4>
                  </div>
                </div>
                <div className="panel-body">
                  {web3.fromWei(balances.walletEthBalance, 'ether')}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Token Balance
                    </h4>
                  </div>
                </div>
                <div className="panel-body">
                  {balances.tokenBalance / Math.pow(10, selectedToken.decimals)}
                </div>
              </div>

              <div className="col-lg-3">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h4 className="panel-title">
                      Wallet Token Balance
                    </h4>
                  </div>
                </div>
                <div className="panel-body">
                  {balances.walletTokenBalance / Math.pow(10, selectedToken.decimals)}
                </div>
              </div>

            </div>
          }

          <BalanceForms tokenAddress={selectedToken.contractAddress}/>

          {orderBookReducer.get('loadingOrders') ?
            "Loading Orders ..."
            :
            <div>
              <div className="row">
                <div className="col-lg-3">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        Bid
                      </h4>
                    </div>
                  </div>
                  <div className="panel-body">
                    {this.getBid(orders)}
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        Ask
                      </h4>
                    </div>
                  </div>
                  <div className="panel-body">
                    {this.getAsk(orders)}
                  </div>
                </div>

              </div>

              <div className="row">
                <div className="col-lg-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h3 className="panel-title">
                        Open Buy Orders
                      </h3>
                    </div>
                    <div className="panel-body">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>User Address</th>
                            <th></th>
                          </tr>
                          </thead>
                          <tbody>
                          {orders ? this.getBuyOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                                    tokenAddress={selectedToken.contractAddress}/>) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h3 className="panel-title">
                        Open Sell Orders
                      </h3>
                    </div>
                    <div className="panel-body">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover table-striped">
                          <thead>
                          <tr>
                            <th>Price</th>
                            <th>Amount</th>
                            <th>User Address</th>
                            <th></th>
                          </tr>
                          </thead>
                          <tbody>
                          {orders ? this.getSellOrders(orders).map((order) => <Order key={order.id} order={order}
                                                                                     tokenAddress={selectedToken.contractAddress}/>) : null}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          }

          <h4>Create New Order</h4>
          <NewOrderForm tokenAddress={selectedToken.contractAddress}/>

          <p>
            <em>Make sure you have enough ETH / Tokens deposited to create / take trades,
              the transaction will fail otherwise</em>
          </p>
        </div>
      </div>
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
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderBook);