import React, { Component } from 'react';
import { connect } from 'react-redux';

import { actions } from './component.js';
import { actions as query_actions } from '../Query/component.js';

const T_mapStateToProps = (state, ownProps) => {
    var myId = parseInt(ownProps.match.params.cxnid);
    var myConnection = state.Connections.connections.find(cxn => {
        return cxn.id == myId;
    });

    var ret = { ...myConnection };
    return {
        cxn: ret
    };
};

const T_mapDispatchToProps = (dispatch) => {
    return {
        addQuery:  (cxnid) => {
            dispatch(query_actions.addQuery({cxnid}));
        },
        connect: (id) => {
            dispatch(actions.connect({id}));
        }
    }
};

let Toolbar = ({ cxn, addQuery, connect }) => {
    return (
        <div className='btn-group'>
            <button className='btn btn-default' title='Connect' onClick={() => connect(cxn.id)}>
                <span className='icon icon-upload-cloud icon-text'></span>
                Connect
            </button>
        { cxn.connected && 
            <button className='btn btn-default' title='New Query' onClick={() => addQuery(cxn.id)}>
                <span className='icon icon-doc-text-inv icon-text'></span>
                New Query
            </button>
        }
        </div>
    );
};

Toolbar = connect(T_mapStateToProps, T_mapDispatchToProps)(Toolbar);

export default Toolbar;