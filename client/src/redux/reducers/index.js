import { combineReducers } from 'redux'
import { loginReducer, registerReducer } from './userReducer'

const UserReducers = combineReducers({
    loginUser: loginReducer,
    registerUser : registerReducer
})
export default UserReducers