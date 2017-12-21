import React, {Component} from 'react'
import {connect} from 'react-redux'

class Footer extends Component {

  componentDidMount() {

  }

  render() {

    return (
      <div className="row footer">
        <span>
          Created By Adil Haritah - 2017
          &nbsp;
          <i className="fa fa-twitter" aria-hidden="true"></i>
          &nbsp;&nbsp;
          <a href="https://twitter.com/le_didil" target="_blank">@le_didil</a>
          &nbsp;&nbsp;
          <i className="fa fa-github" aria-hidden="true"></i>
          &nbsp;&nbsp;
          <a href="https://github.com/didil" target="_blank">didil</a>
        </span>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer);