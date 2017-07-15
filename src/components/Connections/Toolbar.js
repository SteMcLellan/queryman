import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getConnectionStateFromProps } from './selectors.js';
import { actions } from './component.js';
import { actions as query_actions } from '../Query/component.js';

const T_mapStateToProps = (state, ownProps) => {
    return {
        cxn: getConnectionStateFromProps(state, ownProps)
    };
};

const T_mapDispatchToProps = (dispatch) => {
    return {
        addQuery:  (cxnid) => {
            dispatch(query_actions.connectAndAddConnection({cxnid}));
        }
    }
};

let Toolbar = ({ cxn, addQuery, connect }) => {
    return (
        <div className='btn-group'>
            <button className='btn btn-default' title='New Query' onClick={() => addQuery(cxn.id)}>
                <span className='icon icon-doc-text-inv icon-text'></span>
                New Query
            </button>
        </div>
    );
};

Toolbar = connect(T_mapStateToProps, T_mapDispatchToProps)(Toolbar);

export default Toolbar;