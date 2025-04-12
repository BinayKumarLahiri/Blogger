import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // define the Initial State Here
  loggedIn: false,
  user: {},
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.loggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    removeUser: (state, action) => {
      state.loggedIn = false;
      state.user = {};
      state.token = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
