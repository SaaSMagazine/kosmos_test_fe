import { createStore, combineReducers } from 'redux';
import authReducer from '../reducers/authReducer';
import taskReducer from '../reducers/taskReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
});

const store = createStore(rootReducer);

export default store;