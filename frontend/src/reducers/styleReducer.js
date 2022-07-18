import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    navbarOpacity: true,
    loginPopUp: false,
    searchScreen: false
}

export const styleSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        setNavbarOpacity: (state, value) => {
            state.opacity = value.payload;
        },
        setLoginPopUp: (state, value) => {
            state.signUpPopUp = value.payload;
        },
        setSearchScreen: (state, value) => {
            state.searchScreen = value.payload;
        },
    },
})


export const {setNavbarOpacity,setLoginPopUp,setSearchScreen} = styleSlice.actions;