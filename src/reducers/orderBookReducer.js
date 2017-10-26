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

  const setEthBalance = (state) => {
    return state
      .set('ethBalance', action.ethBalance);
  };

  const actions = {
    'SELECT_TOKEN': () => resetOrders(state),
    'FETCH_LOAD_ORDERS_SUCCESS': () => setOrders(state),
    'FETCH_GET_ETH_BALANCE_SUCCESS': () => setEthBalance(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}