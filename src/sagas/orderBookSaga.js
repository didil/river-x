import {call, put, all, select, takeEvery} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as orderBookActions from '../actions/orderBookActions';
import * as notificationActions from '../actions/notificationActions';

import orderBookService from '../utils/orderBookService';

function* loadOrders(data) {
  yield put(orderBookActions.fetchLoadOrders.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));
    const tokenAddress = yield select(state => state.tokenRegistryReducer.get("selectedToken").contractAddress);

    const orders = yield call(orderBookService.loadOrders, web3, tokenAddress);
    yield put(orderBookActions.fetchLoadOrders.success({orders}));
  } catch (error) {
    yield put(orderBookActions.fetchLoadOrders.failure({error}));
  }
}

function* loadBalances(data) {
  yield put(orderBookActions.fetchLoadBalances.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));
    const tokenAddress = yield select(state => state.tokenRegistryReducer.get("selectedToken").contractAddress);

    const balances = yield call(orderBookService.loadBalances, web3, tokenAddress);
    yield put(orderBookActions.fetchLoadBalances.success({balances}));
  } catch (error) {
    yield put(orderBookActions.fetchLoadBalances.failure({error}));
  }
}

function* saveNewTokenDeposit(data) {
  yield put(orderBookActions.postSaveNewTokenDeposit.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const newTokenDepositValue = yield select(state => state.orderBookReducer.get("newTokenDepositValue"));
    const decimals = yield select(state => state.tokenRegistryReducer.get("selectedToken").decimals);
    let parseNewTokenDepositValue = parseFloat(newTokenDepositValue) * Math.pow(10, decimals);

    const results = yield call(orderBookService.depositTokens, web3, data.tokenAddress, parseNewTokenDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(2000);

    yield put(orderBookActions.postSaveNewTokenDeposit.success({results}));

    console.log("saveNewTokenDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new token deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postSaveNewTokenDeposit.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save token deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewTokenWithdrawal(data) {
  yield put(orderBookActions.postSaveNewTokenWithdrawal.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const newTokenWithdrawalValue = yield select(state => state.orderBookReducer.get("newTokenWithdrawalValue"));
    const decimals = yield select(state => state.tokenRegistryReducer.get("selectedToken").decimals);
    let parseNewTokenWithdrawalValue = parseFloat(newTokenWithdrawalValue) * Math.pow(10, decimals);

    const results = yield call(orderBookService.withdrawTokens, web3, data.tokenAddress, parseNewTokenWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(2000);

    yield put(orderBookActions.postSaveNewTokenWithdrawal.success({results}));

    console.log("saveNewTokenWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new token withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postSaveNewTokenWithdrawal.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save token withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* saveNewEthDeposit(data) {
  yield put(orderBookActions.postSaveNewEthDeposit.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const newEthDepositValue = yield select(state => state.orderBookReducer.get("newEthDepositValue"));

    const results = yield call(orderBookService.depositEth, web3, newEthDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(2000);

    yield put(orderBookActions.postSaveNewEthDeposit.success({results}));

    console.log("saveNewEthDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new eth deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postSaveNewEthDeposit.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save eth deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewEthWithdrawal(data) {
  yield put(orderBookActions.postSaveNewEthWithdrawal.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const newEthWithdrawalValue = yield select(state => state.orderBookReducer.get("newEthWithdrawalValue"));

    const results = yield call(orderBookService.withdrawEth, web3, newEthWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(2000);

    yield put(orderBookActions.postSaveNewEthWithdrawal.success({results}));

    console.log("saveNewEthWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new eth withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postSaveNewEthWithdrawal.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save eth withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewOrder(data) {
  yield put(orderBookActions.postSaveNewOrder.request());
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));
    const newOrder = yield select(state => state.orderBookReducer.get("newOrder"));
    const decimals = yield select(state => state.tokenRegistryReducer.get("selectedToken").decimals);

    newOrder.fullDecimalsPrice = parseInt(web3.toWei(parseFloat(newOrder.price), "ether"), 10) / Math.pow(10, decimals); // convert the price to price per micro-unit
    newOrder.fullDecimalsAmount = parseFloat(newOrder.amount) * Math.pow(10, decimals);

    const results = yield call(orderBookService.createOrder, web3, newOrder);

    // delay to allow changes to be committed to local node
    yield delay(3000);

    yield put(orderBookActions.postSaveNewOrder.success({results}));

    console.log("saveNewOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new order saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postSaveNewOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* cancelOrder(data) {
  yield put(orderBookActions.postCancelOrder.request({orderId: data.orderId}));
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const results = yield call(orderBookService.cancelOrder, web3, data.tokenAddress, data.orderId);

    // delay to allow changes to be committed to local node
    yield delay(3000);

    yield put(orderBookActions.postCancelOrder.success({results}));

    console.log("cancelOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'order cancelled successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postCancelOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to cancel order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* takeOrder(data) {
  yield put(orderBookActions.postTakeOrder.request({orderId: data.orderId}));
  try {
    const web3 = yield select(state => state.navbarReducer.get("web3"));

    const results = yield call(orderBookService.takeOrder, web3, data.tokenAddress, data.orderId);

    // delay to allow changes to be committed to local node
    yield delay(3000);

    yield put(orderBookActions.postTakeOrder.success({results}));

    console.log("takeOrder TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'order taken successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(orderBookActions.postTakeOrder.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to take order',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* watchLoadOrders() {
  yield takeEvery(orderBookActions.LOAD_ORDERS, loadOrders);
}

function* watchGetEthBalance() {
  yield takeEvery(orderBookActions.LOAD_BALANCES, loadBalances);
}

function* watchSaveNewTokenDeposit() {
  yield takeEvery(orderBookActions.SAVE_NEW_TOKEN_DEPOSIT, saveNewTokenDeposit);
}

function* watchSaveNewTokenWithdrawal() {
  yield takeEvery(orderBookActions.SAVE_NEW_TOKEN_WITHDRAWAL, saveNewTokenWithdrawal);
}

function* watchPostSaveNewTokenDepositSuccess() {
  yield takeEvery(orderBookActions.POST_SAVE_NEW_TOKEN_DEPOSIT.SUCCESS, loadBalances);
}

function* watchPostSaveNewTokenWithdrawalSuccess() {
  yield takeEvery(orderBookActions.POST_SAVE_NEW_TOKEN_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchSaveNewEthDeposit() {
  yield takeEvery(orderBookActions.SAVE_NEW_ETH_DEPOSIT, saveNewEthDeposit);
}

function* watchSaveNewEthWithdrawal() {
  yield takeEvery(orderBookActions.SAVE_NEW_ETH_WITHDRAWAL, saveNewEthWithdrawal);
}

function* watchPostSaveNewEthDepositSuccess() {
  yield takeEvery(orderBookActions.POST_SAVE_NEW_ETH_DEPOSIT.SUCCESS, loadBalances);
}

function* watchPostSaveNewEthWithdrawalSuccess() {
  yield takeEvery(orderBookActions.POST_SAVE_NEW_ETH_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchSaveNewOrder() {
  yield takeEvery(orderBookActions.SAVE_NEW_ORDER, saveNewOrder);
}

function* watchPostSaveNewOrderSuccess() {
  yield takeEvery(orderBookActions.POST_SAVE_NEW_ORDER.SUCCESS, loadOrders);
  yield takeEvery(orderBookActions.POST_SAVE_NEW_ORDER.SUCCESS, loadBalances);
}

function* watchCancelOrder() {
  yield takeEvery(orderBookActions.CANCEL_ORDER, cancelOrder);
}

function* watchTakeOrder() {
  yield takeEvery(orderBookActions.TAKE_ORDER, takeOrder);
}

function* watchPostCancelOrderSuccess() {
  yield takeEvery(orderBookActions.POST_CANCEL_ORDER.SUCCESS, loadOrders);
  yield takeEvery(orderBookActions.POST_CANCEL_ORDER.SUCCESS, loadBalances);
}

function* watchPostTakeOrderSuccess() {
  yield takeEvery(orderBookActions.POST_TAKE_ORDER.SUCCESS, loadOrders);
  yield takeEvery(orderBookActions.POST_TAKE_ORDER.SUCCESS, loadBalances);
}



export default function* orderBookSaga() {
  yield all([
    watchLoadOrders(),
    watchGetEthBalance(),
    watchSaveNewTokenDeposit(),
    watchSaveNewTokenWithdrawal(),
    watchPostSaveNewTokenDepositSuccess(),
    watchPostSaveNewTokenWithdrawalSuccess(),
    watchSaveNewEthDeposit(),
    watchSaveNewEthWithdrawal(),
    watchPostSaveNewEthDepositSuccess(),
    watchPostSaveNewEthWithdrawalSuccess(),
    watchSaveNewOrder(),
    watchPostSaveNewOrderSuccess(),
    watchCancelOrder(),
    watchTakeOrder(),
    watchPostCancelOrderSuccess(),
    watchPostTakeOrderSuccess(),
  ]);
}