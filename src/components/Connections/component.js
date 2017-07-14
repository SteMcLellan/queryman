// Init reduxHelper
import reduxHelper from '../../utils/reduxHelper.js';
import config from 'electron-json-config';
import {combineReducers} from 'redux';
import { DocumentClient } from 'documentdb';
import DocumentDbHelper from '../../utils/docdbHelper.js'

import component from "./Connection.js";
import toolbar from './Toolbar.js';

const reduxUtil = reduxHelper('Connections');

// Initial State pulled from electron-json-config
let getSavedConfig = () => config.get('Connections.default', []);

let saveConfig = (cxns) => config.set('Connections.default', cxns);

let updateConfig = (cxn) => {
    let savedConfig = getSavedConfig();
    let foundConfig = savedConfig.find(c => c.id === cxn.id);
    if (!foundConfig) {
        saveConfig( [ ...savedConfig, {...cxn} ] );
    } else {
        saveConfig( savedConfig.map(c => 
        (c.id === cxn.id)
            ? {...c, ...cxn}
            : c));
    };
}

let lastSavedEntryId = (cxns) => {
    if (cxns.length === 0) {
        return 0;
    }

    let maxId = Math.max.apply(Math, cxns.map(cxn => cxn.id));
    return ++maxId;
}

const initialConnections = getSavedConfig();

// Action Definitions
const ADD_CONNECTION = reduxUtil.defineAction('ADD_CONNECTION');
const SAVE_CONNECTION = reduxUtil.defineAction('SAVE_CONNECTION');
const DELETE_CONNECTION = reduxUtil.defineAction('DELETE_CONNECTION');
const MAKE_CONNECTION = reduxUtil.defineAction('MAKE_CONNECTION');
const CONNECTED = reduxUtil.defineAction('CONNECTED');

// Make Actions
let nextConnectionId = lastSavedEntryId(initialConnections);

const connect = ({id}) => {
    return (dispatch, getState) => {
        let state = getState();
        let cxn = state.Connections.connections.find(c => c.id === id);
        let docdb = new DocumentDbHelper(cxn);

        dispatch(actions.makeConnection({id, isConnecting: true}));

        docdb.connectToDatabase()
            .then(docdb.connectToCollection.bind(docdb))
            .then(() => {
                dispatch(actions.connected({id, docdb: docdb, isConnecting: false, connected: true}))
            });
    }
}

const actions = {
    addConnection: () => {
        return {
            type: ADD_CONNECTION,
            payload: {
                id: nextConnectionId++,
                connected: false
            }
        };
    },
    saveConnection: reduxUtil.createAction(SAVE_CONNECTION),
    deleteConnection: reduxUtil.createAction(DELETE_CONNECTION),
    makeConnection: reduxUtil.createAction(MAKE_CONNECTION),
    connected: reduxUtil.createAction(CONNECTED),
    connect: connect
};

// Make Reducers

// Reducers for array of connections
const addConnectionReducer = (state, action) => {
    return [... state, {
        id: action.payload.id
    }];
};

const saveConnectionReducer = (state, action) => {
    let newState = state.map(cxn => 
        (cxn.id === action.payload.id)
            ? {...cxn, ...action.payload}
            : cxn
    );

    // also save this value to electron-json-config
    updateConfig(action.payload);

    return newState;
};

const deleteConnectionReducer = (state, action) => {
    return state.filter(cxn => {
        return cxn.id !== action.payload.id;
    });
};

const makeConnectionReducer = (state, action) => {
    return state.map(cxn => 
        (cxn.id === action.payload.id)
        ? {... cxn, ...action.payload}
        : cxn
    );
}

const connectedReducer = (state, action) => {
     return state.map(cxn => 
        (cxn.id === action.payload.id)
        ? {... cxn, ...action.payload}
        : cxn
    );   
}

const cxnArrayReducer = reduxUtil.createReducer({
    [ADD_CONNECTION]: addConnectionReducer,
    [SAVE_CONNECTION]: saveConnectionReducer,
    [DELETE_CONNECTION]: deleteConnectionReducer,
    [MAKE_CONNECTION]: makeConnectionReducer,
    [CONNECTED]: connectedReducer
}, initialConnections);

// root reducer for this component
const reducer = combineReducers({
    connections: cxnArrayReducer
});

// export
export {
    component,
    actions,
    reducer,
    toolbar
};