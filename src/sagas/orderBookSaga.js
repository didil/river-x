import {call, put, fork, all, select,takeEvery} from 'redux-saga/effects';

import * as orderBookActions from '../actions/orderBookActions';
import orderBookService from '../utils/orderBookService';

function* loadOrders(data) {
  yield put(orderBookActions.fetchLoadOrders.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));
    const orders = yield call(orderBookService.loadOrders, web3, data.contractAddress);
    yield put(orderBookActions.fetchLoadOrders.success({orders}));
  } catch (error) {
    yield put(orderBookActions.fetchLoadOrders.failure({error}));
  }
}

function* watchLoadOrders() {
  yield takeEvery(orderBookActions.LOAD_ORDERS, loadOrders);
}

export default function* orderBookSaga() {
  yield all([
    watchLoadOrders()
  ]);
}