import React, {Component} from 'react'

import * as actions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

const _ = require('lodash');

class OrderBook extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let selectedToken = this.props.tokenRegistryReducer.get("selectedToken");
    if (!selectedToken) {
      return this.props.actions.goToHome();
    }

    this.props.actions.loadOrders({contractAddress: selectedToken.contractAddress});
    this.props.actions.loadOrders({contractAddress: selectedToken.contractAddress});
  }

  getBuyOrders(orders) {
    return orders.filter((order) => order.orderType === "buy").sort((a, b) => b.price - a.price);
  }

  getSellOrders(orders) {
    return orders.filter((order) => order.orderType === "sell").sort((a, b) => a.price - b.price);
  }

  getBid(orders) {
    if (_.isEmpty(orders)) {
      return null;
    }

    return this.props.web3.fromWei(this.getBuyOrders(orders)[0].price, 'ether');
  }

  getAsk(orders) {
    if (_.isEmpty(orders)) {
      return null;
    }

    return this.props.web3.fromWei(this.getSellOrders(orders)[0].price, 'ether');
  }

  renderEthBalance(){
    return this.props.web3.fromWei(this.props.orderBookReducer.get("ethBalance"), 'ether');
  }

  renderOrder(order, web3) {
    return (
      <tr key={order.id}>
        <td>{web3.fromWei(order.price, 'ether')}</td>
        <td>{order.amount / (Math.pow(10, this.props.tokenRegistryReducer.get('selectedToken').decimals))}</td>
        <td>{order.userAddress.substring(0, 10) + "***"}</td>
        <td>{order.id}</td>
      </tr>
    );
  }

  render() {
    let {orderBookReducer, web3} = this.props;
    let orders = orderBookReducer.get("orders");

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
            <div className="col-lg-3">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    Balance (ETH)
                  </h4>
                </div>
              </div>
              <div className="panel-body">
                {this.renderEthBalance()}
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
                        <th>Id</th>
                      </tr>
                      </thead>
                      <tbody>
                      {orders ? this.getBuyOrders(orders).map((order) => this.renderOrder(order, web3)) : null}
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
                        <th>Id</th>
                      </tr>
                      </thead>
                      <tbody>
                      {orders ? this.getSellOrders(orders).map((order) => this.renderOrder(order, web3)) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    orderBookReducer: state.orderBookReducer,
    tokenRegistryReducer: state.tokenRegistryReducer,
    web3: state.navbarReducer.get("web3")
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