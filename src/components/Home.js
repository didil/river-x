import React, {Component} from 'react'


import * as actions from '../actions/homeActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/Home.css'

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  selectToken(e, token) {
    e.preventDefault();
    this.props.actions.selectToken({token: token});
    this.props.actions.goToOrderBook();
  }

  render() {
    let {tokenRegistryReducer} = this.props;
    let tokens = tokenRegistryReducer.get('tokens');

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

          <div className="row">

            <div className="col-sm-4">
              <p>Please select a token you'd like to trade</p>

              <div className="list-group">
                {tokens ? tokens.map((token => (
                  <a key={token.id} href="#" className="list-group-item" onClick={(e) => this.selectToken(e,token)}>
                    {token.symbol} ({token.name})
                  </a>
                ))) : null}
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
    tokenRegistryReducer: state.tokenRegistryReducer
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