import React, {Component} from 'react'
import OrderBookContract from '../../build/contracts/OrderBook.json'

const contract = require('truffle-contract');

import * as actions from '../actions/homeActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/Home.css'

class Home extends Component {
  constructor(props) {
    super(props);
  }


  componentWillMount() {

  }

  componentDidMount() {

  }

  render() {

    return (
      <div id="page-wrapper" className="Home">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <h1 className="page-header">
                River X
              </h1>
            </div>
          </div>

        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    orderBookReducer: state.orderBookReducer
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
)(Home);