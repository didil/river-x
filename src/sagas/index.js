import orderBookSaga from './orderBookSaga';
import navbarSaga from './navbarSaga';
import {fork} from 'redux-saga/effects'

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(orderBookSaga);
    yield fork(navbarSaga);
  }

  sagaMiddleware.run(rootSaga);
};