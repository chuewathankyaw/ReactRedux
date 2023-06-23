import { ActionTypes } from "../constants/action-types";


const intialState = {
    users:[],
};



export const loginReducer = (state = intialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.LOGIN:
            return { ...state, users: payload };
        default:
            return state;
    }
}
export const registerReducer = (state = intialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.REGISTER:
            return { ...state, users: payload };
        default:
            return state;
    }
}