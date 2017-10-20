import orderBookSaga from './orderBookSaga';
import navbarSaga from './navbarSaga';
import errorsSaga from './errorsSaga';
import {fork} from 'redux-saga/effects'

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(orderBookSaga);
    yield fork(navbarSaga);
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};