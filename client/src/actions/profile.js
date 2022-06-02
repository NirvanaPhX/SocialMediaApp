import api from "../utils/api";
import { GET_PROFILE, PROFILE_CREATED, PROFILE_ERROR } from "./types";
import { setAlert } from "../actions/alert";

export const getCurrentProfile = () => async (dispatch) => {
  try {
    const resp = await api.get("/profile/me");

    dispatch({ type: GET_PROFILE, payload: resp.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create user profile
export const createProfile =
  (formData, navigate, edit = false) =>
  async (dispatch) => {
    try {
      const resp = await api.post("/profile", formData);

      dispatch({ type: PROFILE_CREATED, payload: resp.data });

      dispatch(
        setAlert(edit ? "Profile Edited" : "Profile Created", "success")
      );

      if (!edit) {
        navigate("/dashboard");
      }
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };