import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as notificationsReducer} from 'react-notification-system-redux';

import orderBookReducer from './orderBookReducer';
import navbarReducer from './navbarReducer';
import tokenRegistryReducer from './tokenRegistryReducer';

const rootReducer = combineReducers({
  orderBookReducer,
  navbarReducer,
  tokenRegistryReducer,
  routing: routerReducer,
  notificationsReducer
});

export default rootReducer;