import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom'

const Menu_mapStateToProps = (state) => { 
  var x = { ...state.Connections, ...state.Query };
  x.router = { ...state.router };
  return x; 
};

const Menu_mapDispatchToProps = (dispatch) => {
  return {

  };
}

let queriesForCxn = (cxnid, queries) => {
  var filteredQueries = queries.filter(q => { return q.cxnid === cxnid });
  return filteredQueries.map(q => (
      <MenuRow key={ `query-div: ${q.id}` } path={ `/query/${q.id}`} label={ `Query: ${q.id}` } icon="doc-text-inv" />
    ));
}

let getLabelForCxn = (cxn) => {
  if (cxn.friendlyName) {
    return cxn.friendlyName
  }

  return `Cxn: ${cxn.id}`;
}

let Menu = ({ connections, router, queries }) => {
  return (
    <nav className="nav-group">
      <h5 className="nav-group-title">Navigation</h5>
      <MenuRow path="/" label="Home" icon="home" />
      {connections.map(cxn => {
        var childQueries = queriesForCxn(cxn.id, queries);

        return (
          <div key={ `cxn-div: ${cxn.id}` }>
            <MenuRow key={cxn.id} path={ `/connection/${cxn.id}` } label={ getLabelForCxn(cxn) } icon="database" />
            { childQueries }
          </div>
        )
        })
      }
    </nav>
  );
}

Menu = connect(Menu_mapStateToProps, Menu_mapDispatchToProps)(Menu);

const MenuRow = (props) => {
  return (
    <NavLink to={props.path} className="nav-group-item" activeClassName="active" exact={true}>
      <span className={"icon icon-" + props.icon}></span>
      {props.label}
    </NavLink>
  )
}

export default Menu;
