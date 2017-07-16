import React, { Component } from 'react';
import { Control, Form, actions as form_Actions } from 'react-redux-form';

const QueryEditor = ({ query }) => {
    let getModelPath = (state) => {
        let idx = state.Query.queries.findIndex(q => q.id === query.id);
        return `Query.queries[${idx}]`;
    };

    return (
        <Form model={getModelPath} id='form-queryString'>
            <Control.textarea className={`form-control`} model='.queryString' id='queryString'/>
        </Form>
    );
};

export default QueryEditor;