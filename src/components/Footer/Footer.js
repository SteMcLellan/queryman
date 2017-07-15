import React, { Component } from 'react';
import { connect } from 'react-redux';

const F_mapStateToProps = (state, props) => {
  let footer = state.Footer;
  return {
    footer
  }
}

let Footer = ({footer}) => {
  return (
    <footer className="toolbar toolbar-footer app-status-bar">
      <h1 className="title pull-left">{ footer.msg }</h1>
    </footer>
  )
}

Footer = connect(F_mapStateToProps)(Footer);

export default Footer;
