import {action} from '../utils/actionUtils';
import {push } from 'react-router-redux'

const SELECT_TOKEN = 'SELECT_TOKEN';
export const selectToken = data => action(SELECT_TOKEN, data);

export const goToOrderBook = data => push('/order-book');
