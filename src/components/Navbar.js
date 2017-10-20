import React, {Component} from 'react'
import {NavLink} from "react-router-dom";

import * as actions from '../actions/navbarActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import '../css/Home.css'

class Navbar extends Component {
  constructor(props) {
    super(props);
  }


  componentWillMount() {

  }

  componentDidMount() {
    this.props.actions.initWeb3();
  }

  render() {
    let {navbarReducer} = this.props;
    let web3 = navbarReducer.get("web3");
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
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
              <i className="fa fa-user"/> { web3 ? web3.eth.defaultAccount : null}
            </a>
          </li>


        </ul>

        <div className="collapse navbar-collapse navbar-ex1-collapse">
          <ul className="nav navbar-nav side-nav">
            <li>
              <NavLink exact to="/"><i className="fa fa-fw fa-dashboard"/>Home</NavLink>
            </li>
            <li>
              <NavLink exact to="/order-book"><i className="fa fa-fw fa-dashboard"/>Order Book</NavLink>
            </li>
          </ul>
        </div>

      </nav>

    );
  }
}


const mapStateToProps = (state) => {
  return {
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
)(Navbar);