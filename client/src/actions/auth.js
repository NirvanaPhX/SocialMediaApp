import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      name,
      email,
      password,
    });

    console.log(body);

    try {
      const res = await axios.post("/api/users", body, config);
      const token = res.data;

      dispatch({ type: REGISTER_SUCCESS, payload: token });
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({ type: REGISTER_FAILURE });
    }
  };

export const loadUser = () => async (dispatch) => {
  const { token } = localStorage;

  // Set axios header attribute 'x-auth-token' to existing token
  token && setAuthToken(token);

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
