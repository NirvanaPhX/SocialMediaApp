import api from "../utils/api";
import { GET_PROFILE, PROFILE_ERROR } from "./types";
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
