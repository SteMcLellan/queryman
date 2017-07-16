const getQueryFromProps = (state, props) => {
    let myId = parseInt(props.match.params.queryid);
    return state.Query.queries.find(q => {
        return q.id === myId;
    });
}

export {
    getQueryFromProps
}