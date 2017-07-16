import React, { Component } from 'react';

const QueryResult = ({ resultString }) => {
    return (
        <pre>
            <code>
                { resultString }
            </code>
        </pre>
    );
};

export default QueryResult;