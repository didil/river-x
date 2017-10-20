import {Map as ImmutableMap} from 'immutable';


export default function tokenRegistryReducer(state = new ImmutableMap({}), action) {

  const setTokens = (state) => {
    return state
      .set('tokens', action.tokens);
  };

  const selectToken = (state) => {
    return state
      .set('selectedToken', action.token);
  };

  const actions = {
    'FETCH_LOAD_TOKENS_SUCCESS': () => setTokens(state),
    'SELECT_TOKEN': () => selectToken(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}