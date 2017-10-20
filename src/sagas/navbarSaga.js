import {call, put, all, takeEvery} from 'redux-saga/effects';

import * as navbarActions from '../actions/navbarActions';

import web3Service from '../utils/web3Service';
import tokenRegistryService from '../utils/tokenRegistryService';


function* initWeb3(data) {
  yield put(navbarActions.setupWeb3.request());
  try {
    const {web3, networkName} = yield call(web3Service.getWeb3);
    yield put(navbarActions.setupWeb3.success({web3, networkName}));

    yield put(navbarActions.loadTokens({web3}));
  } catch (error) {
    yield put(navbarActions.setupWeb3.failure({error}));
  }
}

function* loadTokens(data) {
  yield put(navbarActions.fetchLoadTokens.request());
  try {
    const tokens = yield call(tokenRegistryService.loadTokens, data.web3);
    yield put(navbarActions.fetchLoadTokens.success({tokens}));
  } catch (error) {
    yield put(navbarActions.fetchLoadTokens.failure({error}));
  }
}

function* watchInitWeb3() {
  yield takeEvery(navbarActions.INIT_WEB3, initWeb3);
}

function* watchLoadTokens() {
  yield takeEvery(navbarActions.LOAD_TOKENS, loadTokens);
}

export default function* navbarSaga() {
  yield all([
    watchInitWeb3(),
    watchLoadTokens()
  ]);
}