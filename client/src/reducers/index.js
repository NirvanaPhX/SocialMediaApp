import { combineReducers } from "redux";
import alertReducer from "./alert";
import authReducer from "./auth";
import profileReducer from "./profile";
import postReducer from "./post";

const rootReducer = combineReducers({
  authReducer,
  alertReducer,
  profileReducer,
  postReducer,
});

export default rootReducer;
