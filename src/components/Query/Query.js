import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Control, Form, actions as form_Actions } from 'react-redux-form';

import { actions } from './component.js';
import styles from './component.less';
import Highlight from './Highlight.js';

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
                        <div className={styles.wrap}>           
                            <Control.textarea className={`form-control`} model='.queryString' id='queryString'/>
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

                    // {/*<Highlight className='json'>
                    //     { query.resultString }
                    // </Highlight>*/}
                    // {   
                    //     query.isExecuting &&
                    //     <pre> <code>Executing Query...</code></pre>
                    // }
                    // {
                    //     !query.isExecuting &&                    
                    //     <pre>
                    //         <code>
                    //             { query.resultString }
                    //         </code>
                    //     </pre>
                    // }