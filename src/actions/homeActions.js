import {action, createRequestTypes} from '../utils/actionUtils';
import {push } from 'react-router-redux'

const SELECT_TOKEN = 'SELECT_TOKEN';
export const selectToken = data => action(SELECT_TOKEN, data);

const GO_TO_ORDER_BOOK = 'GO_TO_ORDER_BOOK';
export const goToOrderBook = data => push('/order-book');
