import { Map as ImmutableMap } from 'immutable';


export default function orderBookReducer(state = new ImmutableMap({}), action) {

  const setOrders = (state) => {
    return state
      .set('orders', action.orders);
  };

  const resetOrders = (state) => {
    return state
      .set('orders', []);
  };

  const actions = {
    'SELECT_TOKEN': () => resetOrders(state),
    'FETCH_LOAD_ORDERS_SUCCESS': () => setOrders(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}