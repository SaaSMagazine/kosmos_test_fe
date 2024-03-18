// Типы действий
const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

// Начальное состояние
const initialState = {
  isLoggingIn: false,
  isLoggedIn: false,
  userData: null,
  error: null
};


const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        userData: action.payload
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userData: null
      };
    default:
      return state;
  }
};

export default authReducer;


export const loginRequest = () => ({
  type: LOGIN_REQUEST
});

export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: LOGOUT
});