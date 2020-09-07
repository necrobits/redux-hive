import _ from 'lodash';
import { fromJS } from 'immutable';

function createReducer(
  {
    initialState = {},
    handlers = {},
    addons = [],
  } = {}) {
  let _state = initialState;
  let _handlers = handlers;
  _.forEach(addons, (addon) => {
    const addonState = addon.initialState || {};
    const addonHandlers = addon.handlers || [];
    _state = _.merge(_state, addonState);
    _handlers = _.merge(_handlers, addonHandlers);
  });

  const _initialState = _state;
  return (state = _initialState, action) => {
    if (_.has(_handlers, action.type)) {
      return _handlers[action.type](state, action);
    }
    return state;
  };
}

export default createReducer;