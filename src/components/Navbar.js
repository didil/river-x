import React, {Component} from 'react'
import {NavLink} from "react-router-dom";
import Notifications from 'react-notification-system-redux';

import * as navbarActions from '../actions/navbarActions';
import * as notificationActions from '../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/Home.css'

class Navbar extends Component {

  componentDidMount() {
    this.props.navbarActions.initWeb3();

    this.props.notificationActions.success({
      notification: {
        message: 'Welcome to River X',
        position: 'br'
      }
    });
  }

  render() {
    let {navbarReducer, tokenRegistryReducer} = this.props;
    let web3 = navbarReducer.get("web3");
    let networkName = navbarReducer.get("networkName");
    let token = tokenRegistryReducer.get("selectedToken");

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <Notifications
          notifications={this.props.notifications}
        />
        <div className="navbar-header">
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
          <a className="navbar-brand" href="index.html">River X</a>
        </div>
        <ul className="nav navbar-right top-nav">

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <b>Token:</b> {token ? token.symbol:null}
            </a>
          </li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <b>Network:</b> {networkName}
            </a>
          </li>

          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-user"/> {web3 ? web3.eth.defaultAccount : null}
            </a>
          </li>

        </ul>

        <div className="collapse navbar-collapse navbar-ex1-collapse">
          <ul className="nav navbar-nav side-nav">
            <li>
              <NavLink exact to="/"><i className="fa fa-fw fa-dashboard"/>Home</NavLink>
            </li>
            <li>
              <NavLink exact to="/order-book"><i className="fa fa-fw fa-book"/>Order Book</NavLink>
            </li>
          </ul>
        </div>

      </nav>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    navbarReducer: state.navbarReducer,
    tokenRegistryReducer: state.tokenRegistryReducer,
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navbarActions: bindActionCreators(navbarActions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);