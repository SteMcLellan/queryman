import React, { Component } from 'react';
import { track, Control, Form, actions as form_Actions } from 'react-redux-form';

const isMyQuery = (id) => (q) => q.id === id;

const QueryEditor = ({ query, onChange }) => {

    //TODO: look into a better way to handle keydown events.
    //Possible events to handle: TAB, F5 or SHIFT-ENTER (for execute?)
    let onKeyDown = (e) => {
        if(e.keyCode === 9) {
            console.log('tab!');

            // get caret position/selection
            let val = e.target.value,
                start = e.target.selectionStart,
                end = e.target.selectionEnd;

            let newValue = val.substring(0, start) + '\t' + val.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 1;
            onChange(newValue);
            
            e.preventDefault();
        }
    };

    return (
        <Form model={track('Query.queries[]', isMyQuery(query.id))} id='form-queryString'>
            <Control.textarea className={`form-control`} model='.queryString' id='queryString' onKeyDown={onKeyDown}/>
        </Form>
    );
};

export default QueryEditor;