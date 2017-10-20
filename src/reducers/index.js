import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import orderBookReducer from './orderBookReducer';
import navbarReducer from './navbarReducer';

const rootReducer = combineReducers({
  orderBookReducer,
  navbarReducer,
  routing: routerReducer,
});

export default rootReducer;