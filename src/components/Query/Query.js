import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Control, Form, actions as form_Actions } from 'react-redux-form';

import { actions } from './component.js';
import styles from './component.less';

const QueryProperties = ({metrics}) => {
    return (
        <div className={styles.queryProperties}>
            <table className='table-striped'>
                <caption>Query Properties</caption>
                <thead>
                    <tr>
                        <th>
                            Metric
                        </th>
                        <th>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    { metrics.map((m, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{m.key}</td>
                                <td>{m.value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const QUERY_mapStateToProps = (state, ownProps) => {
    let myId = parseInt(ownProps.match.params.queryid);
    let myQuery = state.Query.queries.find(q => {
        return q.id === myId;
    });

    return {
        query: { ... myQuery }
    };
}

const QUERY_mapDispatchToProps = (dispatch) => {
    return { 
    };
}

let Query = ({ query, executeQuery, executeNextPage }) => {
    let getModelPath = (state) => {
        let idx = state.Query.queries.findIndex(q => q.id === query.id);
        return `Query.queries[${idx}]`;
    };

    return (
        <div className={styles.query}>
            <Form model={getModelPath} id='form-queryString' className=''>  
            <div className='pane-group'>
                <div className='pane'>
                    <div className={styles.queryLeft} style={{height: 'calc(100% - 250px)'}}>
                        <div className={styles.queryWrap}>           
                            <Control.textarea className={`form-control`} model='.queryString' id='queryString'/>
                        </div>
                        <div className={styles.properties}>
                            <QueryProperties metrics={query.metrics || []}/>
                        </div>
                    </div>
                </div>
                <div className='pane'>
                    <pre>
                        <code>
                            { query.resultString }
                        </code>
                    </pre>
                </div>
            </div>
            </Form>
        </div>       
    );
};

Query = connect(QUERY_mapStateToProps, QUERY_mapDispatchToProps)(Query);

export default Query;