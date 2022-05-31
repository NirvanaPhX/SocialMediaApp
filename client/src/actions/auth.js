import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
} from "./types";
import { setAlert } from "./alert";
import api from "../utils/api";

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const body = {
      name,
      email,
      password,
    };

    try {
      const res = await api.post("/users", body);

      dispatch({ type: REGISTER_SUCCESS, payload: res.data });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({ type: REGISTER_FAILURE });
    }
  };

export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get("/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);

    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const body = {
      email,
      password,
    };

    try {
      const res = await api.post("/auth", body);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });

      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };
