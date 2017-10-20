import {action, createRequestTypes} from '../utils/actionUtils';

export const INIT_WEB3 = 'INIT_WEB3';
export const initWeb3 = data => action(INIT_WEB3, data);

export const SETUP_WEB3 = createRequestTypes('SETUP_WEB3');
export const setupWeb3 = {
  request: () => action(SETUP_WEB3.REQUEST),
  success: (data) => action(SETUP_WEB3.SUCCESS, data),
  failure: (error) => action(SETUP_WEB3.FAILURE, error),
};

export const LOAD_TOKENS = 'LOAD_TOKENS';
export const loadTokens = data => action(LOAD_TOKENS, data);

export const FETCH_LOAD_TOKENS = createRequestTypes('FETCH_LOAD_TOKENS');
export const fetchLoadTokens = {
  request: () => action(FETCH_LOAD_TOKENS.REQUEST),
  success: (data) => action(FETCH_LOAD_TOKENS.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_TOKENS.FAILURE, error),
};