import { Map as ImmutableMap } from 'immutable';

let initialData = {
  orders: [],
  balances: {},
  newTokenDepositValue: 0,
  newTokenWithdrawalValue: 0,
  newEthDepositValue: 0,
  newEthWithdrawalValue: 0,
  newOrder: {
    tokenAddress: null,
    orderType: 1,
    price: 0,
    amount: 0,
  },
};

export default function orderBookReducer(state = new ImmutableMap(initialData), action) {

  const resetOrdersAndBalances = (state) => {
    return state
      .set('orders', [])
      .set('balances', {})
      ;
  };

  const fetchLoadOrdersRequest = (state) => {
    return state
      .set('loadingOrders', true);
  };

  const fetchLoadOrdersSuccess = (state) => {
    return state
      .set('loadingOrders', false)
      .set('orders', action.orders);
  };

  const fetchLoadOrdersFailure = (state) => {
    return state
      .set('loadingOrders', false);
  };

  const fetchLoadBalancesRequest = (state) => {
    return state
      .set('loadingBalances', true);
  };

  const fetchLoadBalancesSuccess = (state) => {
    return state
      .set('loadingBalances', false)
      .set('balances', action.balances);
  };

  const fetchLoadBalancesFailure = (state) => {
    return state
      .set('loadingBalances', false);
  };

  const setNewTokenDepositValue = (state) => {
    return state
      .set('newTokenDepositValue', action.newTokenDepositValue);
  };

  const postSaveNewTokenDepositRequest = (state) => {
    return state
      .set('savingNewTokenDeposit', true);
  };

  const postSaveNewTokenDepositSuccess = (state) => {
    return state
      .set('savingNewTokenDeposit', false)
      .set('newTokenDepositValue', 0);
  };

  const postSaveNewTokenDepositFailure = (state) => {
    return state
      .set('savingNewTokenDeposit', false);
  };

  const setNewTokenWithdrawalValue = (state) => {
    return state
      .set('newTokenWithdrawalValue', action.newTokenWithdrawalValue);
  };

  const postSaveNewTokenWithdrawalRequest = (state) => {
    return state
      .set('savingNewTokenWithdrawal', true);
  };

  const postSaveNewTokenWithdrawalSuccess = (state) => {
    return state
      .set('savingNewTokenWithdrawal', false)
      .set('newTokenWithdrawalValue', 0);
  };

  const postSaveNewTokenWithdrawalFailure = (state) => {
    return state
      .set('savingNewTokenWithdrawal', false);
  };

  const setNewEthDepositValue = (state) => {
    return state
      .set('newEthDepositValue', action.newEthDepositValue);
  };

  const postSaveNewEthDepositRequest = (state) => {
    return state
      .set('savingNewEthDeposit', true);
  };

  const postSaveNewEthDepositSuccess = (state) => {
    return state
      .set('savingNewEthDeposit', false)
      .set('newEthDepositValue', 0);
  };

  const postSaveNewEthDepositFailure = (state) => {
    return state
      .set('savingNewEthDeposit', false);
  };

  const setNewEthWithdrawalValue = (state) => {
    return state
      .set('newEthWithdrawalValue', action.newEthWithdrawalValue);
  };

  const postSaveNewEthWithdrawalRequest = (state) => {
    return state
      .set('savingNewEthWithdrawal', true);
  };

  const postSaveNewEthWithdrawalSuccess = (state) => {
    return state
      .set('savingNewEthWithdrawal', false)
      .set('newEthWithdrawalValue', 0);
  };

  const postSaveNewEthWithdrawalFailure = (state) => {
    return state
      .set('savingNewEthWithdrawal', false);
  };

  const setNewOrder = (state) => {
    return state
      .set('newOrder', action.newOrder);
  };

  const postSaveNewOrderRequest = (state) => {
    return state
      .set('savingNewOrder', true);
  };

  const postSaveNewOrderSuccess = (state) => {
    return state
      .set('savingNewOrder', false)
      .set('newOrder', initialData.newOrder);
  };

  const postSaveNewOrderFailure = (state) => {
    return state
      .set('savingNewOrder', false);
  };

  const postCancelOrderRequest = (state) => {
    return state
      .set('cancellingOrder', action.orderId);
  };

  const postCancelOrderSuccess = (state) => {
    return state
      .set('cancellingOrder', null);
  };

  const postCancelOrderFailure = (state) => {
    return state
      .set('cancellingOrder', null);
  };

  const postTakeOrderRequest = (state) => {
    return state
      .set('takingOrder', action.orderId);
  };

  const postTakeOrderSuccess = (state) => {
    return state
      .set('takingOrder', null);
  };

  const postTakeOrderFailure = (state) => {
    return state
      .set('takingOrder', null);
  };

  const actions = {
    'SELECT_TOKEN': () => resetOrdersAndBalances(state),
    'FETCH_LOAD_ORDERS_REQUEST': () => fetchLoadOrdersRequest(state),
    'FETCH_LOAD_ORDERS_SUCCESS': () => fetchLoadOrdersSuccess(state),
    'FETCH_LOAD_ORDERS_FAILURE': () => fetchLoadOrdersFailure(state),
    'FETCH_LOAD_BALANCES_REQUEST': () => fetchLoadBalancesRequest(state),
    'FETCH_LOAD_BALANCES_SUCCESS': () => fetchLoadBalancesSuccess(state),
    'FETCH_LOAD_BALANCES_FAILURE': () => fetchLoadBalancesFailure(state),
    'SET_NEW_TOKEN_DEPOSIT_VALUE': () => setNewTokenDepositValue(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_REQUEST': () => postSaveNewTokenDepositRequest(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_SUCCESS': () => postSaveNewTokenDepositSuccess(state),
    'POST_SAVE_NEW_TOKEN_DEPOSIT_FAILURE': () => postSaveNewTokenDepositFailure(state),
    'SET_NEW_TOKEN_WITHDRAWAL_VALUE': () => setNewTokenWithdrawalValue(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_REQUEST': () => postSaveNewTokenWithdrawalRequest(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_SUCCESS': () => postSaveNewTokenWithdrawalSuccess(state),
    'POST_SAVE_NEW_TOKEN_WITHDRAWAL_FAILURE': () => postSaveNewTokenWithdrawalFailure(state),
    'SET_NEW_ETH_DEPOSIT_VALUE': () => setNewEthDepositValue(state),
    'POST_SAVE_NEW_ETH_DEPOSIT_REQUEST': () => postSaveNewEthDepositRequest(state),
    'POST_SAVE_NEW_ETH_DEPOSIT_SUCCESS': () => postSaveNewEthDepositSuccess(state),
    'POST_SAVE_NEW_ETH_DEPOSIT_FAILURE': () => postSaveNewEthDepositFailure(state),
    'SET_NEW_ETH_WITHDRAWAL_VALUE': () => setNewEthWithdrawalValue(state),
    'POST_SAVE_NEW_ETH_WITHDRAWAL_REQUEST': () => postSaveNewEthWithdrawalRequest(state),
    'POST_SAVE_NEW_ETH_WITHDRAWAL_SUCCESS': () => postSaveNewEthWithdrawalSuccess(state),
    'POST_SAVE_NEW_ETH_WITHDRAWAL_FAILURE': () => postSaveNewEthWithdrawalFailure(state),
    'SET_NEW_ORDER': () => setNewOrder(state),
    'POST_SAVE_NEW_ORDER_REQUEST': () => postSaveNewOrderRequest(state),
    'POST_SAVE_NEW_ORDER_SUCCESS': () => postSaveNewOrderSuccess(state),
    'POST_SAVE_NEW_ORDER_FAILURE': () => postSaveNewOrderFailure(state),
    'POST_CANCEL_ORDER_REQUEST': () => postCancelOrderRequest(state),
    'POST_CANCEL_ORDER_SUCCESS': () => postCancelOrderSuccess(state),
    'POST_CANCEL_ORDER_FAILURE': () => postCancelOrderFailure(state),
    'POST_TAKE_ORDER_REQUEST': () => postTakeOrderRequest(state),
    'POST_TAKE_ORDER_SUCCESS': () => postTakeOrderSuccess(state),
    'POST_TAKE_ORDER_FAILURE': () => postTakeOrderFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}