import {
  DELETE_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKE,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";
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

// Delete a post
export const deletePost = (post_id) => async (dispatch) => {
  try {
    const resp = await api.delete(`/posts/${post_id}`);

    dispatch({ type: DELETE_POST, payload: post_id });

    dispatch(setAlert(resp.data.msg, "success"));
  } catch (err) {
    dispatch({
      type: "POST_ERROR",
      payload: {
        msg: err.response.statusText,
        status: err.response.status,
      },
    });
  }
};

// Add a post
export const addPost = (text) => async (dispatch) => {
  try {
    const resp = await api.post("/posts", text);

    dispatch({ type: ADD_POST, payload: resp.data });
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

// Get a post
export const getPost = (post_id) => async (dispatch) => {
  try {
    const resp = await api.get(`/posts/${post_id}`);

    dispatch({ type: GET_POST, payload: resp.data });
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

// Add a comment
export const addComment = (post_id, text) => async (dispatch) => {
  try {
    const resp = await api.post(`/posts/comment/${post_id}`, text);

    dispatch({ type: ADD_COMMENT, payload: resp.data });

    dispatch(setAlert("Comment Added", "success"));
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

// Delete comment
export const deleteComment = (post_id, comment_id) => async (dispatch) => {
  try {
    const resp = await api.delete(`/posts/comment/${post_id}/${comment_id}`);

    dispatch({ type: REMOVE_COMMENT, payload: resp.data });
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
