import { Map as ImmutableMap } from 'immutable';


export default function orderBookReducer(state = new ImmutableMap({x:"AAAAA"}), action) {

  const actions = {
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}