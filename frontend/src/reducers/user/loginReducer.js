import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import Axios from "axios"

export const fetchLogin = createAsyncThunk('user/login', async (props, {rejectWithValue}) => {
    const {email, password} = props;
    try {
        const response = await Axios.post(api.user.login, {
            email: email,
            password: password
        });
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})

export const fetchRegister = createAsyncThunk('user/register', async (props, {rejectWithValue}) => {
    const {login, email, password} = props;
    try {
        const response = await Axios.post(api.user.register, {
            login: login,
            email: email,
            password: password
        });
        return response.data
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
})


const initialState = {
    inProgress: false,
    isLogin: localStorage.getItem('isLogin') === 'true',
    registerMsg: '',
    email: localStorage.getItem('email') ? localStorage.getItem('email') : '',
    login: localStorage.getItem('login') ? localStorage.getItem('login') : '',
    token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
    isAdmin: localStorage.getItem('isAdmin') ? parseInt(localStorage.getItem('token'), 10) : '',
    error: ''
}

export const userSlice = createSlice({
    name: 'user', initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('isLogin');
            localStorage.removeItem('email');
            localStorage.removeItem('login');
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            state.isLogin = false;
            state.token = '';
            state.email = '';
            state.login = '';
            state.isAdmin = '';

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchLogin.pending, state => {
            state.inProgress = true;
        })
        builder.addCase(fetchLogin.fulfilled, (state, action) => {
            state.isLogin = !!action.payload.token;
            state.email = action.payload.email;
            state.login = action.payload.login;
            state.token = action.payload.token;
            state.isAdmin = action.payload.isAdmin;

            localStorage.setItem('isLogin', 'true');
            localStorage.setItem('email', action.payload.email);
            localStorage.setItem('login', action.payload.login);
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('isAdmin', action.payload.isAdmin);

            state.error = '';
            state.inProgress = false;
        })
        builder.addCase(fetchLogin.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.error = action.payload ? action.payload : action.error.message;
        })

        builder.addCase(fetchRegister.pending, state => {
            state.inProgress = true;
        })

        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.inProgress = false;
            state.registerMsg = action.payload;
            state.error = '';
        })

        builder.addCase(fetchRegister.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.error = action.payload ? action.payload : action.error.message;
        })
    }
})

export const {logout} = userSlice.actions;