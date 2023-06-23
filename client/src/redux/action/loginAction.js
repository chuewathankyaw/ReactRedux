import { ActionTypes } from "../constants/action-types";
import LoginApi from "../../apis/LoginApi";

export const loginUser = (data) => {
  return async (dispatch) => {
    const response = await LoginApi.post("/login", data);

    dispatch({
      type: ActionTypes.LOGIN,
      payload: response.data,
    });
  };
};
export const registerUser = (data) => {
  return async (dispatch) => {
    const response = await LoginApi.post("/post", data);

    dispatch({
      type: ActionTypes.REGISTER,
      payload: response.data,
    });
  };
};
