const reduxHelper = ( moduleName ) => {

  // Helps to standardize and keep actions unique across your application
  const defineAction = ( actionName ) => {
    return moduleName +"/"+ actionName;
  }

  // Reduces boilerplate
  const createAction = ( type ) => {
    return function actionCreator( payload ) {
      return { type, payload: { ...payload } };
    };
  }

  // Reduces boilerplate
  const createReducer = ( cases, defaultState ) => {
    defaultState = defaultState || {};
    return function reducer( state, action ) {
      action = action || {};
      if (state === undefined) {
        return defaultState;
      }
      for (let caseName in cases) {
        if (action.type === caseName) {
          return cases[caseName](state, action);
        }
      }
      return state;
    };
  }

  const isOwnedAction = (action) => {
    return action.type.startsWith(moduleName);
  }

  return {
    defineAction,
    createAction,
    createReducer,
    isOwnedAction
  }
};

export default reduxHelper;
