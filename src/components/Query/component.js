// Init reduxHelper
import reduxHelper from '../../utils/reduxHelper.js';
import DocumentDbHelper from '../../utils/docdbHelper.js'
import { combineReducers } from 'redux';
import { combineForms } from 'react-redux-form';
import { getConnectionStateFromId } from '../Connections/selectors.js';
import component from "./Query.js";
import toolbar from './Toolbar.js';

import { actions as cxn_actions } from '../Connections/component.js';
import { actions as footer_actions } from '../Footer/component.js';

const reduxUtil = reduxHelper('Query');

// Make Actions
const ADD_QUERY = reduxUtil.defineAction('ADD_QUERY');
const NEXT_PAGE = reduxUtil.defineAction('NEXT_PAGE');
const RUN_QUERY = reduxUtil.defineAction('RUN_QUERY');
const RUNNING_QUERY = reduxUtil.defineAction('RUNNING_QUERY');
const RECEIVE_QUERY_RESULTS = reduxUtil.defineAction('RECEIVE_QUERY_RESULTS');
const REMOVE_QUERY = reduxUtil.defineAction('REMOVE_QUERY');
const QUERYSTRING_UPDATED = reduxUtil.defineAction('QUERYSTRING_UPDATED');

let nextQueryId = 0;

let sendReceiveQueryResults = (id, queryProcessor, results, metrics) => {
    let resultString = JSON.stringify(results, null, 2);
    return actions.receiveQueryResults({
        id,
        isExecuting: false,
        queryProcessor: queryProcessor,
        results: results,
        metrics: metrics,
        resultString: resultString
    });
};

const dispatchFooterMsg = (dispatch, msg) => {
    dispatch(footer_actions.newFooterMsg({ newmsg: msg }));
};

const runQuery = ({id}) => {
    return (dispatch, getState) => {
        let isExecuting = true;
        let state = getState();

        dispatch(actions.runningQuery({id, isExecuting}));

        let query = state.Query.queries.find(q => q.id === id);
        let cxn = getConnectionStateFromId(state, query.cxnid);

        dispatchFooterMsg(dispatch, 'Executing query...');
        let queryProcessor = cxn.docdb.executeQuery(query.queryString);
        queryProcessor.getNextResultSet()
            .then((r) => {
                dispatchFooterMsg(dispatch, 'Query execution completed.');
                dispatch(sendReceiveQueryResults(id, queryProcessor, r.results, r.metrics));
            });
    };
};

const nextPage = ({id}) => {
    return (dispatch, getState) => {
        let state = getState();

        dispatch(actions.runningQuery({id, isExecuting: true}));
        dispatchFooterMsg(dispatch, 'Executing query...');
        let query = state.Query.queries.find(q => q.id === id);

        query.queryProcessor.getNextResultSet()
            .then((r) => {
                dispatchFooterMsg(dispatch, 'Query execution completed.');
                dispatch(sendReceiveQueryResults(id, query.queryProcessor, r.results, r.metrics));
            });
    };
};

const connectAndAddConnection = ({cxnid}) => {
    return (dispatch, getState) => {
        let state = getState();

        let cxn = state.Connections.connections.find(cxn => cxn.id === cxnid);
        if (!cxn.docdb) {
            dispatchFooterMsg(dispatch, `Connecting to ${cxn.friendlyName}...`);
            return dispatch(cxn_actions.connect({id: cxnid}))
                .then(() => {
                    dispatchFooterMsg(dispatch, 'Connected.');
                    dispatch(actions.addQuery({cxnid}));
                });
        } else {
            return dispatch(actions.addQuery({cxnid}));
        }
    }
};

const actions = {
    addQuery: (payload) => {
        return {
            type: ADD_QUERY,
            payload: {
                id: nextQueryId ++,
                cxnid: payload.cxnid,
                queryString: 'select * from c'
            }
        };
    },
    connectAndAddConnection: connectAndAddConnection,    
    nextPage: nextPage,
    queryStringUpdated: reduxUtil.createAction(QUERYSTRING_UPDATED),
    runQuery: runQuery,
    runningQuery: reduxUtil.createAction(RUNNING_QUERY),
    receiveQueryResults: reduxUtil.createAction(RECEIVE_QUERY_RESULTS),
    removeQuery: reduxUtil.createAction(REMOVE_QUERY)
};
 
// Make Reducers
const modifyQuery = (state, action) => {
    return {...state, ...action.payload};
};

const queryReducer = reduxUtil.createReducer({
    [RUNNING_QUERY]: modifyQuery,
    [RECEIVE_QUERY_RESULTS]: modifyQuery,
    [QUERYSTRING_UPDATED]: modifyQuery
}, {});

const addQuery = (state, action) => {
    return [...state, {...action.payload}];
};

const removeQuery = (state, action) => {
    return state.filter(q => q.id !== action.payload.id);
};

const queryArrayReducer = (state, action) => {
    if (state === undefined) {
        return [];
    } else if (!reduxUtil.isOwnedAction(action)) {
        return state;
    }

    switch(action.type)
    {
        case ADD_QUERY:
            return addQuery(state, action);

        case REMOVE_QUERY:
            return removeQuery(state, action);

        default:
            return state.map(q => 
                (q.id === action.payload.id)
                ? queryReducer(q, action)
                : q
            );
    }
};

const reducer = combineReducers({
    queries: queryArrayReducer
});

export {
    component,
    actions,
    reducer,
    toolbar
};

