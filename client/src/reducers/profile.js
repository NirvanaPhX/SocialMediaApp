import {
  CLEAR_PROIFLE,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_CREATED,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  UPDATE_PROFILES,
  GET_GH_REPOS,
} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case PROFILE_CREATED:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case CLEAR_PROIFLE:
      return {
        ...state,
        loading: false,
        profile: null,
        repos: [],
      };
    case UPDATE_PROFILES:
    case GET_PROFILES:
      return {
        ...state,
        loading: false,
        profiles: payload,
      };
    case GET_GH_REPOS:
      return {
        ...state,
        loading: false,
        repos: payload,
      };
    default:
      return state;
  }
}
