//TODO: Look into memoized selectors?

const getConnectionStateFromProps = (state, props) => {
    let myId = parseInt(props.match.params.cxnid);
    return state.Connections.connections.find(cxn => cxn.id === myId);
};

const getConnectionStateFromId = (state, id) => {
    return state.Connections.connections.find(cxn => cxn.id === id);
};

export {
    getConnectionStateFromId,
    getConnectionStateFromProps
};