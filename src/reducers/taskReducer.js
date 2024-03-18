// Типы действий
const ADD_TASK = 'ADD_TASK';
const UPDATE_TASK = 'UPDATE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const SET_TASKS = 'SET_TASKS';

// Начальное состояние
const initialState = {
  tasks: []
};


const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    default:
      return state;
  }
};

export default taskReducer;


export const addTask = (task) => ({
  type: ADD_TASK,
  payload: task
});

export const updateTask = (task) => ({
  type: UPDATE_TASK,
  payload: task
});

export const deleteTask = (taskId) => ({
  type: DELETE_TASK,
  payload: taskId
});

export const setTasks = (tasks) => ({
  type: SET_TASKS,
  payload: tasks
});