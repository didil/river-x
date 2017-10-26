import {action, createRequestTypes} from '../utils/actionUtils';
import {push} from 'react-router-redux'


export const goToHome = data => push('/');

export const LOAD_ORDERS = 'LOAD_ORDERS';
export const loadOrders = data => action(LOAD_ORDERS, data);

export const FETCH_LOAD_ORDERS = createRequestTypes('FETCH_LOAD_ORDERS');
export const fetchLoadOrders = {
  request: () => action(FETCH_LOAD_ORDERS.REQUEST),
  success: (data) => action(FETCH_LOAD_ORDERS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_ORDERS.FAILURE, error),
};

export const GET_ETH_BALANCE = 'GET_ETH_BALANCE';
export const getEthBalance = data => action(GET_ETH_BALANCE, data);

export const FETCH_GET_ETH_BALANCE = createRequestTypes('FETCH_GET_ETH_BALANCE');
export const fetchGetEthBalance = {
  request: () => action(FETCH_GET_ETH_BALANCE.REQUEST),
  success: (data) => action(FETCH_GET_ETH_BALANCE.SUCCESS, data),
  failure: (error) => action(FETCH_GET_ETH_BALANCE.FAILURE, error),
};