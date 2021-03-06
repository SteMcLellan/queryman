import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import highlightjs from 'highlight.js';
import styles from './component.less';

//TODO: this crappy impl of highlight.js really chokes on larger result sets (100ish JSON objects)
class Highlight extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.highlightCode();
    }

    componentDidUpdate() {
        this.highlightCode();
    }

    highlightCode() {
        let block = ReactDOM.findDOMNode(this).querySelectorAll('pre code');
        highlightjs.highlightBlock(block[0]);
    }

    render() {
        const { className, children } = this.props;

        return (
            <pre>
                <code className={`${className} ${styles.hljs}`}>
                    { children }
                </code>
            </pre>
        );
    }
}

export default Highlight;