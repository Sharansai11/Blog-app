// Create Redux slice with async thunk for login
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Make HTTP request using redux-thunk middleware
export const userAuthorLoginThunk = createAsyncThunk(
    "user-author-login",
    async (userCredObj, thunkApi) => {
        try {
            let res;
            if (userCredObj.userType === "user") {
                res = await axios.post(
                    "http://localhost:4000/user-api/login",
                    userCredObj
                );
            } else if (userCredObj.userType === "author") {
                res = await axios.post(
                    "http://localhost:4000/author-api/login",
                    userCredObj
                );
            }

            if (res.data.message === "login success") {
                // Store token in local/session storage
                localStorage.setItem("token", res.data.token);
                // Return data
                return res.data;
            } else {
                return thunkApi.rejectWithValue(res.data.message);
            }
        } catch (err) {
            return thunkApi.rejectWithValue(err.message);
        }
    }
);

export const userAuthorSlice = createSlice({
    name: "user-author-login",
    initialState: {
        isPending: false,
        loginUserStatus: false,
        currentUser: {},
        errorOccurred: false,
        errMsg: "",
    },
    reducers: {
        resetState: (state) => {
            state.isPending = false;
            state.currentUser = {};
            state.loginUserStatus = false;
            state.errorOccurred = false;
            state.errMsg = "";
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(userAuthorLoginThunk.pending, (state) => {
                state.isPending = true;
            })
            .addCase(userAuthorLoginThunk.fulfilled, (state, action) => {
                state.isPending = false;
                state.currentUser = action.payload.user; // Ensure 'user' exists in response
                state.loginUserStatus = true;
                state.errMsg = "";
                state.errorOccurred = false;
            })
            .addCase(userAuthorLoginThunk.rejected, (state, action) => {
                state.isPending = false;
                state.currentUser = {};
                state.loginUserStatus = false;
                state.errMsg = action.payload;
                state.errorOccurred = true;
            }),
});

// Export action creator functions
export const { resetState } = userAuthorSlice.actions;
// Export root reducer of this slice
export default userAuthorSlice.reducer;
