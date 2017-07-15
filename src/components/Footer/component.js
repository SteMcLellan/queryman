// Include component
import reduxHelper from '../../utils/reduxHelper.js';

import component from './Footer.js';

const reduxUtil = reduxHelper('Footer');

const NEW_FOOTER_MSG = reduxUtil.defineAction('NEW_FOOTER_MSG');

const actions = {
  newFooterMsg: reduxUtil.createAction(NEW_FOOTER_MSG)
}

const newmsg_reducer = (state, action) => {
  let msg = action.payload.newmsg;
  return {...state, msg };
}

const reducer = reduxUtil.createReducer({
    [NEW_FOOTER_MSG]: newmsg_reducer
}, { msg: '' });

// Export
export {
  component,
  reducer,
  actions
};
