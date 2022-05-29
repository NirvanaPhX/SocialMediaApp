import axios from "axios";
import { REGISTER_SUCCESS, REGISTER_FAILURE } from "./types";
import { setAlert } from "./alert";

export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const body = JSON.stringify({
      name,
      email,
      password,
    });

    console.log(body);

    try {
      const res = await axios.post("/api/users", body, config);
      const token = res.data;

      dispatch({ type: REGISTER_SUCCESS, payload: token });
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({ type: REGISTER_FAILURE });
    }
  };
