import React, { Component } from 'react';
import { connect } from 'react-redux';

import { actions } from './component.js';

const T_mapStateToProps = (state, ownProps) => {
    let myId = parseInt(ownProps.match.params.queryid);
    let myQuery = state.Query.queries.find(q => {
        return q.id === myId;
    });

    return {
        query: { ... myQuery }
    };
};

const T_mapDispatchToProps = (dispatch) => {
    return { 
        executeQuery: (id) => {
            dispatch(actions.runQuery({id}));
        },
        executeNextPage: (id) => {
            dispatch(actions.nextPage({id}));
        }
    };
};

let Toolbar = ({ query, executeQuery, executeNextPage }) => {
    return (
        <span>
            <div className='btn-group'>
                <button className='btn btn-default' onClick={() => executeQuery(query.id)}>
                    <span className='icon icon-rocket icon-text'></span>Execute Query
                </button>
            </div>

            <button className='btn btn-default pull-right' onClick={() => executeNextPage(query.id)}>
                <span className='icon icon-right-circled icon-text'></span>Next Page
            </button>
        </span>
    );
};

Toolbar = connect(T_mapStateToProps, T_mapDispatchToProps)(Toolbar);

export default Toolbar;