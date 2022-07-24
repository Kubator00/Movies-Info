import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {serverGraphQl} from "../api";
import {gql, GraphQLClient, request} from "graphql-request";

export const fetchLogin = createAsyncThunk('user/login', async (props, {rejectWithValue}) => {

    const {email, password} = props;
    const client = new GraphQLClient(serverGraphQl);
    const query = gql`
        mutation {
            login(email: "${email}", password: "${password}") {
                    email,
                    login,
                    token,
                    isAdmin        
                }
            }`
    return await client.request(query)
        .then(data => {
            return data.login[0];
        }).catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });
})

export const fetchRegister = createAsyncThunk('user/register', async (props, {rejectWithValue}) => {
    const {login, email, password} = props;
    const query = gql`
    mutation {
        register(email: "${email}", login: "${login}", password: "${password}")
    }`

    return await request(serverGraphQl, query)
        .then((data) => data)
        .catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });

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
            state.error = action.payload ? action.payload : 'Error occurred';
        })

        builder.addCase(fetchRegister.pending, state => {
            state.inProgress = true;
        })

        builder.addCase(fetchRegister.fulfilled, (state, action) => {
            state.inProgress = false;
            state.registerMsg = action.payload.register;
            state.error = '';
        })

        builder.addCase(fetchRegister.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.error = action.payload ? action.payload : 'Error occurred';
        })
    }
})

export const {logout} = userSlice.actions;