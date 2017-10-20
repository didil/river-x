import {takeEvery, takeLatest} from 'redux-saga';
import {call, put, fork,all} from 'redux-saga/effects';

import * as navbarActions from '../actions/navbarActions';

import web3Service from '../utils/web3Service';


function* initWeb3(data) {
  yield put(navbarActions.setupWeb3.request());
  try {
    const web3 = yield call(web3Service.getWeb3);
      yield put(navbarActions.setupWeb3.success({web3:web3}));
  } catch (error) {
    yield put(navbarActions.setupWeb3.failure(error));
  }
}


function* watchInitWeb3() {
  yield takeEvery(navbarActions.INIT_WEB3, initWeb3);
}

export default function* navbarSaga() {
  yield all([
    watchInitWeb3()
  ]);
}