import { combineReducers } from "redux";
import alertReducer from "./alert";
import authReducer from "./auth";

const rootReducer = combineReducers({ authReducer, alertReducer });

export default rootReducer;
