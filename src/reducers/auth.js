import { getAccessTokenCookie, getCookies } from "@/utils/cookies";
import { createSlice } from "@reduxjs/toolkit";

// initialize refreshToken from local storage
const getRefreshToken = getCookies();

const initialState = {
  loading: false,
  userInfo: null,
  refreshToken: getRefreshToken,
  error: null,
  success: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginRequest: (state, { payload }) => {
      console.log("loading");
      state.loading = true;
    },
    setUserDetails: (state, { payload }) => {
      const { userInfo, refreshToken, success } = payload;
      state.loading = false;
      state.userInfo = userInfo;
      state.refreshToken = refreshToken;
      state.success = success;
    },
    errorToLogin: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
    userLogout: (state, { payload }) => {
      return initialState;
    }
  }
})
const { reducer, actions } = authSlice;

export const {
  setLoginRequest,
  setUserDetails,
  errorToLogin,
  userLogout
} = actions;

export default reducer;
