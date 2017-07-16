import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { actions as cxn_actions, toolbar as cxn_toolbar } from '../Connections/component.js'
import { toolbar as query_toolbar } from '../Query/component.js';


const DynamicBar = () => {
    return (
        <Switch>
            <Route path="/connection/:cxnid" component={cxn_toolbar} />
            <Route path="/query/:queryid" component={query_toolbar} />
        </Switch>
    );
}

const PersistentBar = ({ btns }) => {
    return (    
        <div className='btn-group nav-actions'>

            { btns.map(b => {
                return (
                    <button key={b.id} className='btn btn-default' onClick={b.click}>
                        <span className={`icon icon-${b.icon}`}></span>
                    </button>
                );
            })}
            
        </div>
    );
}

const T_mapStateToProps = (state, ownProps) => {
    return {
        router: state.router
    };
};

const T_mapDispatchToProps = (dispatch) => {
    return {
        addConnection: () => {
            dispatch(cxn_actions.addConnection());
        }
    };
};

let Toolbar = ({ addConnection }) => {
    let pButtons = [
        {
            id: 1,
            click: addConnection,
            icon: 'plus'
        }
    ];

  return (
    <header className="toolbar toolbar-header">
        <h1 className="title">queryman</h1>
        <div className="toolbar-actions">
            <PersistentBar btns={pButtons} />
            <DynamicBar />
        </div>
    </header>
  )
}

Toolbar = connect(T_mapStateToProps, T_mapDispatchToProps)(Toolbar);

export default Toolbar;
