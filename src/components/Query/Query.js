import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from './component.js';

import styles from './component.less';
import { getQueryFromProps } from './selectors.js';

import QueryMetrics from './QueryMetrics.js';
import QueryResult from './QueryResult.js';
import QueryEditor from './QueryEditor.js';

const QUERY_mapStateToProps = (state, ownProps) => {
    let query = getQueryFromProps(state, ownProps);
    return {
        query: query || {}
    };
}

const QUERY_mapDispatchToProps = (dispatch) => {
    return {
        updateQueryString: (id, newValue) => {
            dispatch(actions.queryStringUpdated({id: id, queryString: newValue}));
        }
    };
};

let Query = ({ query, executeQuery, executeNextPage, updateQueryString }) => {
    let getModelPath = (state) => {
        let idx = state.Query.queries.findIndex(q => q.id === query.id);
        return `Query.queries[${idx}]`;
    };

    let onQueryStringChanged = (newVal) => {
        updateQueryString(query.id, newVal);
    }

    return (
        <div className={styles.query}>
            <div className='pane-group'>
                <div className='pane'>
                    <div className={styles.queryLeft} style={{height: 'calc(100% - 250px)'}}>
                        <div className={styles.queryWrap}>       
                            <QueryEditor query={query} onChange={onQueryStringChanged} />    
                        </div>
                        <div className={styles.properties}>
                            <QueryMetrics metrics={query.metrics || []}/>
                        </div>
                    </div>
                </div>
                <div className='pane'>
                    <QueryResult resultString={query.resultString}/>
                </div>
            </div>
        </div>       
    );
};

Query = connect(QUERY_mapStateToProps, QUERY_mapDispatchToProps)(Query);

export default Query;