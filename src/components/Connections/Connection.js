import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Control, Form, actions as form_Actions } from 'react-redux-form';

import { actions } from './component.js';
import { actions as query_actions } from '../Query/component.js';

const CXNSettings_mapStateToProps = (state, ownProps) => {
  var myId = parseInt(ownProps.match.params.cxnid);
  var myConnection = state.Connections.connections.find(cxn => {
    return cxn.id == myId;
  });

  var ret = { ...myConnection };
  return {
    cxn: ret
  };
};

const CXNSettings_mapDispatchToProps = (dispatch) => {
  return {
    saveConnection: (payload) => {
      dispatch(actions.saveConnection(payload));
    },
    deleteConnection: (id) => {
      dispatch(actions.deleteConnection({id}));
      dispatch(push('/'));
    }
  };
}

let FormInputItem = ({label, model, id}) => {
  return (
    <div className='form-group'>
      <label htmlFor={id}>{label}</label>
      <Control.text className='form-control' model={model} id={id} />
    </div>
  );
};

let ConnectionSettings = ({ cxn, saveConnection, deleteConnection, addQuery }) => {
  let getModelPath = (state) => {
    let idx = state.Connections.connections.findIndex(c => c.id === cxn.id);
    return `Connections.connections[${idx}]`;
  };

  return (
    <Form model={getModelPath}>
      <div>
        <div className="box">

          <header className="toolbar toolbar-header">
            <h1 className="title">Connection Settings { cxn.id }</h1>
          </header>

          <div className="padded">
            <FormInputItem label='Endpoint' model='.endpoint' id='endpoint' />
            <FormInputItem label='Authentication Key' model='.authKey' id='authKey' />
            <FormInputItem label='Database' model='.database' id='database' />
            <FormInputItem label='Collection' model='.collection' id='collection' />
          </div>

          <footer className="toolbar toolbar-footer">
            <div className="toolbar-actions">
              <button className='btn btn-negative pull-right' onClick={() => deleteConnection(cxn.id)}>Delete</button>
              <button className="btn btn-primary pull-right" onClick={() => saveConnection(cxn.id)}>Save</button>
            </div>
          </footer>

        </div>
      </div>
    </Form>
  )
};

ConnectionSettings = connect(CXNSettings_mapStateToProps, CXNSettings_mapDispatchToProps)(ConnectionSettings);

export default ConnectionSettings;