import {action, createRequestTypes} from '../utils/actionUtils';

const TEST_ACTION = 'TEST_ACTION';
export const testAction = data => action(TEST_ACTION, data);
