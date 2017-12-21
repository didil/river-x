import React, {Component} from 'react'

const _ = require('lodash');

import * as orderBookActions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

class NewOrderForm extends Component {

  componentDidMount() {
  }

  updateInputValue(value, field) {
    let newOrder = Object.assign({}, this.props.orderBookReducer.get("newOrder"));
    newOrder[field] = value;
    this.props.orderBookActions.setNewOrder({newOrder});
  }

  formValid() {
    let amount = parseFloat(this.props.orderBookReducer.get("newOrder").amount);
    let price = parseFloat(this.props.orderBookReducer.get("newOrder").price);
    let orderType = this.props.orderBookReducer.get("newOrder").orderType;
    return amount > 0 && price > 0 && (orderType === 1 || orderType === 2);
  }

  onSubmit(e) {
    e.preventDefault();

    this.updateInputValue(this.props.tokenAddress, "tokenAddress");
    this.props.orderBookActions.saveNewOrder();
  }

  render() {
    let {orderBookReducer} = this.props;
    let newOrder = orderBookReducer.get('newOrder');

    return (
      <form className="new-order-form form-horizontal" onSubmit={(e) => this.onSubmit(e)}>
        <div className="form-group row">
          <label className="control-label col-sm-3">Order Type:</label>
          <div className="col-sm-5">
            <select value={newOrder.orderType}
                    onChange={(e) => this.updateInputValue(parseInt(e.target.value, 10), 'orderType')}>
              <option value={1}>BUY</option>
              <option value={2}>SELL</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">Price:</label>
          <div className="col-sm-5">
            <input type="text" name="price" placeholder="2" className="form-control"
                   value={newOrder.price}
                   onChange={(e) => this.updateInputValue(e.target.value, 'price')}/>
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-sm-3">Amount:</label>
          <div className="col-sm-5">
            <input type="text" name="amount" placeholder="50" className="form-control"
                   value={newOrder.amount}
                   onChange={(e) => this.updateInputValue(e.target.value, 'amount')}/>
          </div>
        </div>

        <div className="form-group row">
          <div className="col-sm-5">
            <button className="btn btn-info" type="submit"
                    disabled={!this.formValid() || orderBookReducer.get("savingNewOrder")}>
              Submit
            </button>
          </div>
        </div>

        {orderBookReducer.get("savingNewOrder") ? <em>Saving ...</em> : null}
      </form>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Reducer: state.web3Reducer,
    orderBookReducer: state.orderBookReducer
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
)(NewOrderForm);