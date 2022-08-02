import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serverGraphQl } from "../api";
import { gql, GraphQLClient, request } from "graphql-request";

export const fetchLogin = createAsyncThunk('user/login', async (props, { rejectWithValue }) => {
    const { email, password } = props;
    const client = new GraphQLClient(serverGraphQl);
    const query = gql`
        mutation Mutation($email: String, $password: String) {
            login(email: $email, password: $password) {
                    email,
                    login,
                    token,
                    isAdmin        
                }
            }`;

    const variables = {
        email, password
    };

    return await client.request(query, variables)
        .then(data => {
            return data.login;
        }).catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });
})

export const fetchRegister = createAsyncThunk('user/register', async (props, { rejectWithValue }) => {
    const { login, email, password } = props;
    const query = gql`
    mutation Register($email: String, $login: String, $password: String) {
        register(email: $email, login: $login, password: $password)
    }`;

    const variables = {
        login, email, password
    };

    return await request(serverGraphQl, query, variables)
        .then((data) => data)
        .catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });

})

export const changePassword = createAsyncThunk('user/changePassword', async (props, { rejectWithValue }) => {
    const { newPassword, email, currentPassword } = props;
    const query = gql`
    mutation Register($userEmail: String, $password: String, $newPassword: String, $userToken: String){
        changePassword(userEmail: $userEmail, password: $password, newPassword: $newPassword, userToken: $userToken)
    }`;

    const variables = {
        newPassword,
        userEmail: email,
        password: currentPassword,
        userToken: localStorage.getItem('token')
    };

    return await request(serverGraphQl, query, variables)
        .then((data) => data)
        .catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });

})

export const changeEmail = createAsyncThunk('user/changeEmail', async (props, { rejectWithValue }) => {
    const { currentEmail, newEmail, password } = props;
    const query = gql`
    mutation ChangeEmail($userEmail: String, $password: String, $newEmail: String, $userToken: String){
        changeEmail(userEmail: $userEmail, password: $password, newEmail: $newEmail, userToken: $userToken)
    }`;

    const variables = {
        newEmail,
        userEmail: currentEmail,
        password,
        userToken: localStorage.getItem('token')
    };

    return await request(serverGraphQl, query, variables)
        .then((data) => data)
        .catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });

})


export const changeAvatar = createAsyncThunk('user/userImgUpload', async (file, { rejectWithValue }) => {
    const query = gql`
    mutation($file: Upload!, $userToken:String, $userEmail:String, $userLogin:String){
        changeAvatar (
        file: $file,
        userToken: $userToken,
        userEmail: $userEmail,
        userLogin: $userLogin)
     }`

    const variables = {
        file: file,
        userToken: localStorage.getItem('token'),
        userEmail: localStorage.getItem('email'),
        userLogin: localStorage.getItem('login'),
    };

    return await request(serverGraphQl, query, variables)
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((err) => {
            return rejectWithValue(err.response.errors[0].message)
        });

})


const initialState = {
    inProgress: false,
    isLogin: localStorage.getItem('isLogin') === 'true',
    registerMsg: '',
    changePasswordMsg: '',
    changePasswordError: '',
    changeEmailMsg: '',
    changeEmailError: '',
    changeAvatarMsg: '',
    changeAvatarError: '',
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

        builder.addCase(changePassword.pending, state => {
            state.inProgress = true;
        })
        builder.addCase(changePassword.fulfilled, (state, action) => {
            state.inProgress = false;
            state.changePasswordMsg = action.payload.changePassword;
            state.changePasswordError = '';
        })
        builder.addCase(changePassword.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.changePasswordError = action.payload ? action.payload : 'Error occurred';
        })

        builder.addCase(changeEmail.pending, state => {
            state.inProgress = true;
        })
        builder.addCase(changeEmail.fulfilled, (state, action) => {
            state.inProgress = false;
            state.changeEmailMsg = action.payload.changeEmail;
            state.changeEmailError = '';
        })
        builder.addCase(changeEmail.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.changeEmailError = action.payload ? action.payload : 'Error occurred';
        })

        builder.addCase(changeAvatar.pending, state => {
            state.inProgress = true;
        })
        builder.addCase(changeAvatar.fulfilled, (state, action) => {
            state.inProgress = false;
            state.changeAvatarMsg = action.payload.changeAvatar;
            state.changeAvatarError = '';
        })
        builder.addCase(changeAvatar.rejected, (state, action) => {
            state.inProgress = false;
            console.error(action)
            state.changeAvatarError = action.payload ? action.payload : 'Error occurred';
        })
    }
})

export const { logout } = userSlice.actions;