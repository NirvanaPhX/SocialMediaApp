import { GET_POSTS, POST_ERROR, UPDATE_LIKE } from "./types";
import api from "../utils/api";
import { setAlert } from "./alert";

// Get all posts
export const getPosts = () => async (dispatch) => {
  try {
    const resp = await api.get("/posts");

    dispatch({ type: GET_POSTS, payload: resp.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.resposne.status,
      },
    });
  }
};

// Like a post
export const likePost = (post_id) => async (dispatch) => {
  try {
    const resp = await api.put(`/posts/like/${post_id}`);

    dispatch({ type: UPDATE_LIKE, payload: { id: post_id, likes: resp.data } });
  } catch (err) {
    const errors = err.response.data;

    if (errors) {
      dispatch(setAlert(errors.msg, "danger"));
    }

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Unlike a post
export const unlikePost = (post_id) => async (dispatch) => {
  try {
    const resp = await api.put(`/posts/unlike/${post_id}`);

    dispatch({ type: UPDATE_LIKE, payload: { id: post_id, likes: resp.data } });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};
