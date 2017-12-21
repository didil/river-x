import React, {Component} from 'react'

const _ = require('lodash');

import * as orderBookActions from '../actions/orderBookActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


class BalanceForms extends Component {

  componentDidMount() {
  }

  updateNewEthDepositValue(e) {
    this.props.orderBookActions.setNewEthDepositValue({newEthDepositValue: e.target.value});
  }

  isValidNewEthDeposit() {
    let newEthDepositValue = parseFloat(this.props.orderBookReducer.get("newEthDepositValue"));
    return newEthDepositValue > 0;
  }

  saveNewEthDeposit() {
    this.props.orderBookActions.saveNewEthDeposit();
  }

  updateNewEthWithdrawalValue(e) {
    this.props.orderBookActions.setNewEthWithdrawalValue({newEthWithdrawalValue: e.target.value});
  }

  isValidNewEthWithdrawal() {
    let newEthWithdrawalValue = parseFloat(this.props.orderBookReducer.get("newEthWithdrawalValue"));
    return newEthWithdrawalValue > 0;
  }

  saveNewEthWithdrawal() {
    this.props.orderBookActions.saveNewEthWithdrawal();
  }

  updateNewTokenDepositValue(e) {
    this.props.orderBookActions.setNewTokenDepositValue({newTokenDepositValue: e.target.value});
  }

  isValidNewTokenDeposit() {
    let newTokenDepositValue = parseFloat(this.props.orderBookReducer.get("newTokenDepositValue"));
    return newTokenDepositValue > 0;
  }

  saveNewTokenDeposit() {
    this.props.orderBookActions.saveNewTokenDeposit({tokenAddress: this.props.tokenAddress});
  }

  updateNewTokenWithdrawalValue(e) {
    this.props.orderBookActions.setNewTokenWithdrawalValue({newTokenWithdrawalValue: e.target.value});
  }

  isValidNewTokenWithdrawal() {
    let newTokenWithdrawalValue = parseFloat(this.props.orderBookReducer.get("newTokenWithdrawalValue"));
    return newTokenWithdrawalValue > 0;
  }

  saveNewTokenWithdrawal() {
    this.props.orderBookActions.saveNewTokenWithdrawal({tokenAddress: this.props.tokenAddress});
  }


  render() {
    let {orderBookReducer} = this.props;


    return (
      <div className="row balance-forms">
        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-7">
              <input name="ethDeposit" type="text"
                     value={orderBookReducer.get("newEthDepositValue")}
                     onChange={(e) => this.updateNewEthDepositValue(e)}
                     className="form-control" placeholder="ETH amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-primary" onClick={this.saveNewEthDeposit.bind(this)}
                      disabled={!this.isValidNewEthDeposit() || orderBookReducer.get("savingNewEthDeposit")}>
                Deposit ETH
              </button>
              {orderBookReducer.get("savingNewEthDeposit") ? <em>Saving ...</em> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-7">
              <input name="ethWithdrawal" type="text"
                     value={orderBookReducer.get("newEthWithdrawalValue")}
                     onChange={(e) => this.updateNewEthWithdrawalValue(e)}
                     className="form-control" placeholder="ETH amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-primary" onClick={this.saveNewEthWithdrawal.bind(this)}
                      disabled={!this.isValidNewEthWithdrawal() || orderBookReducer.get("savingNewEthWithdrawal")}>
                Withdraw ETH
              </button>
              {orderBookReducer.get("savingNewEthWithdrawal") ? <em>Saving ...</em> : null}
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="row">
            <div className="col-sm-7">
              <input name="tokenDeposit" type="text"
                     value={orderBookReducer.get("newTokenDepositValue")}
                     onChange={(e) => this.updateNewTokenDepositValue(e)}
                     className="form-control" placeholder="Token amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-primary" onClick={this.saveNewTokenDeposit.bind(this)}
                      disabled={!this.isValidNewTokenDeposit() || orderBookReducer.get("savingNewTokenDeposit")}>
                Deposit Token
              </button>
              {orderBookReducer.get("savingNewTokenDeposit") ? <em>Saving ...</em> : null}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-7">
              <input name="tokenWithdrawal" type="text"
                     value={orderBookReducer.get("newTokenWithdrawalValue")}
                     onChange={(e) => this.updateNewTokenWithdrawalValue(e)}
                     className="form-control" placeholder="Token amount"/>
            </div>
            <div className="col-sm-5">
              <button type="button" className="btn btn-primary" onClick={this.saveNewTokenWithdrawal.bind(this)}
                      disabled={!this.isValidNewTokenWithdrawal() || orderBookReducer.get("savingNewTokenWithdrawal")}>
                Withdraw Token
              </button>
              {orderBookReducer.get("savingNewTokenWithdrawal") ? <em>Saving ...</em> : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    navbarReducer: state.navbarReducer,
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
)(BalanceForms);