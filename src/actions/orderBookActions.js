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