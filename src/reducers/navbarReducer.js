import {Map as ImmutableMap} from 'immutable';


export default function navbarReducer(state = new ImmutableMap({}), action) {

  const setWeb3 = (state) => {
    return state.set('web3', action.web3);
  };

  const actions = {
    'SETUP_WEB3_SUCCESS': () => setWeb3(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}