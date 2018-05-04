import axios from 'axios';

//ACTION TYPE
const SET_CURRENT_USER = 'SET_CURRENT_USER';

//ACTION CREATOR
function setUser(user){
  return {
    type: SET_CURRENT_USER,
    user
  }
}

//REDUCER
export default function reducer (currentUser = null, action){
  switch(action.type){
    case SET_CURRENT_USER: 
      return action.user;
    default:
      return currentUser;
  }
}

//THUNK
export const login = credentials => dispatch => {
  return axios.post('/login', credentials)
    .then(res => {
      return res.data
    })
    .then(user => {
      dispatch(setUser(user));
      console.log('this is User:', user)
      return user;
    })
}

// export const loginAndGoToUser = (credentials) => dispatch => {
//   dispatch(login(credentials))
//     .then(user => {

//     })
// }