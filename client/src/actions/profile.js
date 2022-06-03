import api from "../utils/api";
import {
  GET_PROFILE,
  PROFILE_CREATED,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROIFLE,
  GET_PROFILES,
  GET_GH_REPOS,
} from "./types";
import { setAlert } from "../actions/alert";

// Get current user profile
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

// Create/Edit user profile
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

// Get all profiles
export const getAllProfiles = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROIFLE });

  try {
    const resp = await api.get("/profile");

    dispatch({ type: GET_PROFILES, payload: resp.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.resposne.status,
      },
    });
  }
};

// Get profile by ID
export const getProfileByUserId = (user_id) => async (dispatch) => {
  try {
    const resp = await api.get(`/profile/${user_id}`);

    dispatch({ type: GET_PROFILES, payload: resp.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Get Github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const resp = await api.get(`/profile/github/${username}`);

    dispatch({ type: GET_GH_REPOS, payload: resp.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Add Experience
export const addExperience = (formData, navigate) => async (dispatch) => {
  try {
    const resp = await api.put("/profile/experience", formData);

    dispatch({ type: UPDATE_PROFILE, payload: resp.data });

    dispatch(setAlert("Experience successfully added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Education
export const addEducation = (formData, navigate) => async (dispatch) => {
  try {
    const resp = await api.put("/profile/education", formData);

    dispatch({ type: UPDATE_PROFILE, payload: resp.data });

    dispatch(setAlert("Education successfully added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.map((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Experience
export const deleteExperience = (exp_id) => async (dispatch) => {
  try {
    const resp = await api.delete(`/profile/experience/${exp_id}`);

    dispatch({ type: UPDATE_PROFILE, payload: resp.data });

    dispatch(setAlert("Experience has been deleted successfully", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.resposne.status,
      },
    });
  }
};

// Delete Education
export const deleteEducation = (edu_id) => async (dispatch) => {
  try {
    const resp = await api.delete(`/profile/education/${edu_id}`);

    dispatch({ type: UPDATE_PROFILE, payload: resp.data });

    dispatch(setAlert("Education has been deleted successfully", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Delete Profile
export const deleteProfile = () => async (dispatch) => {
  try {
    const resp = await api.delete("/profile");

    dispatch({ type: ACCOUNT_DELETED });
    dispatch({ type: CLEAR_PROIFLE });
    dispatch(setAlert("Account has been deleted", "danger"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
