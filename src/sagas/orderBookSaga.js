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

function* getEthBalance(data) {
  yield put(orderBookActions.fetchGetEthBalance.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));
    const userAddress = web3.eth.defaultAccount;
    const ethBalance = yield call(orderBookService.getEthBalance, web3, userAddress);
    yield put(orderBookActions.fetchLoadOrders.success({ethBalance}));
  } catch (error) {
    yield put(orderBookActions.fetchLoadOrders.failure({error}));
  }
}

function* watchLoadOrders() {
  yield takeEvery(orderBookActions.LOAD_ORDERS, loadOrders);
}

function* watchGetEthBalance() {
  yield takeEvery(orderBookActions.GET_ETH_BALANCE, getEthBalance);
}

export default function* orderBookSaga() {
  yield all([
    watchLoadOrders(),
    watchGetEthBalance(),
  ]);
}