import React, {Component} from 'react'

import * as actions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


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
  }

  getBuyOrders(orders){
    return orders.filter((order) => order.orderType ==="buy").sort((a,b) => b.price - a.price);
  }

  getSellOrders(orders){
    return orders.filter((order) => order.orderType ==="sell").sort((a,b) => a.price - b.price);
  }

  renderOrder(order, web3) {
    return (
      <tr key={order.id}>
        <td>{web3.fromWei(order.price, 'ether')}</td>
        <td>{order.amount}</td>
        <td>{order.userAddress.substring(0, 10) + "***"}</td>
        <td>{order.id}</td>
      </tr>
    );
  }

  render() {
    let {orderBookReducer, navbarReducer} = this.props;
    let web3 = navbarReducer.get("web3");
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

            <div className="col-lg-6">
              <h2>Open Buy Orders</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead>
                  <tr>
                    <th>price</th>
                    <th>amount</th>
                    <th>userAddress</th>
                    <th>id</th>
                  </tr>
                  </thead>
                  <tbody>
                  {orders ? this.getBuyOrders(orders).map((order) => this.renderOrder(order, web3)) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-lg-6">
              <h2>Open Sell Orders</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                  <thead>
                  <tr>
                    <th>price</th>
                    <th>amount</th>
                    <th>userAddress</th>
                    <th>id</th>
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
    );
  }
}


const mapStateToProps = (state) => {
  return {
    orderBookReducer: state.orderBookReducer,
    tokenRegistryReducer: state.tokenRegistryReducer,
    navbarReducer: state.navbarReducer
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