import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionsRequests,
  loginUser,
  registerUser,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetched: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = {
          message: "knocking the doro",
        };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = {
          message: "Login is successful",
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = {
          message: "Registering you",
        };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = {
          message: "Register is successful, Please login",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionRequest.fulfilled, (state, action) => {
        state.connections = action.payload.connections;
      })
      .addCase(getConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionsRequests.fulfilled, (state, action) => {
        state.connectionRequest = action.payload.connections;
      })
      .addCase(getMyConnectionsRequests.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});
export const { reset, emptyMessage, setTokenIsNotThere, setTokenIsThere } =
  authSlice.actions;
export default authSlice.reducer;
