import axios from 'axios'
import { UNAUTH_USER, AUTH_USER, AUTH_ERROR, FETCH_MESSAGE } from './types'
const ROOT_URL = 'http://localhost:3090'

export function signinUser({ email, password }) {

  return function (dispatch) {

    // Submit email/password to server
    const request = axios.post(`${ROOT_URL}/signin`, { email, password })
    request
      .then(response => {
        // If request is good...
        // - Save the JWT Token to LocalStorage
        localStorage.setItem('token', response.data.token)

        // - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER })
      })

      // If request is bad...
      // - Show an error to the user
      .catch(() => {
        dispatch(authError('Signin failed. Please try again.'));
      })

  }
}

export function signoutUser() {
  localStorage.removeItem('token')
  return {
    type: UNAUTH_USER
  }
}

export function signupUser({ email, password, passwordConfirmation }) {
  return function (dispatch) {
    axios.post(`${ROOT_URL}/signup`, { email, password, passwordConfirmation })
      .then(response => {
        dispatch({ type: AUTH_USER })
        localStorage.setItem('token', response.data.token)
      })
      .catch(({ response }) => {
        dispatch(authError(response.data.error))
      })
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function fetchMessage() {
  return function (dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
  }
}