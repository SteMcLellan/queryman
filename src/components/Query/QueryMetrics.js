import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './component.less';

const QueryMetricRow = ({ label, metricValue }) => {
    return (
        <tr>
            <td> {label} </td>
            <td> {metricValue} </td>
        </tr>
    );
}

const QueryMetrics = ({metrics}) => {
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
                            <QueryMetricRow key={idx} label={m.key} metricValue={m.value} />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default QueryMetrics;