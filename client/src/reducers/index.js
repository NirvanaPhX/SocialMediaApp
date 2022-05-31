import { combineReducers } from "redux";
import alertReducer from "./alert";
import authReducer from "./auth";
import profileReducer from "./profile";

const rootReducer = combineReducers({
  authReducer,
  alertReducer,
  profileReducer,
});

export default rootReducer;
